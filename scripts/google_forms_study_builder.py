
#!/usr/bin/env python3
"""
Create 3 Google Forms for the XR structural biology study.

What this script creates:
1. XR Lesson Study: Pre-Lesson Survey
2. XR Lesson Study: Station Survey
3. XR Lesson Study: Final Comparison Survey

Requirements:
- Google Forms API enabled in your Google Cloud project
- Desktop OAuth credentials saved as credentials.json in the same folder
- Python packages:
    pip install --upgrade google-api-python-client google-auth-httplib2 google-auth-oauthlib

Notes:
- Forms are created unpublished first, then published at the end.
- By default, the forms are created as standard forms, not quizzes.
- Set PRE_FINAL_AS_QUIZZES and STATION_AS_QUIZ to True if you want automatic grading.
- The Google Forms REST API does not expose a method to attach Google Sheets
  response destinations. This script can emit an Apps Script helper file that
  links each created form to a new spreadsheet in one extra step.
"""

from __future__ import annotations

import json
import os
import sys
from pathlib import Path
from typing import Any, Dict, List, Optional

try:
    from google.auth.transport.requests import Request
    from google.oauth2.credentials import Credentials
    from google_auth_oauthlib.flow import InstalledAppFlow
    from googleapiclient.discovery import build
    from googleapiclient.errors import HttpError
except ModuleNotFoundError as exc:
    active_python = Path(sys.executable)
    raise SystemExit(
        "Missing Google API client libraries in the active interpreter.\n"
        f"Interpreter: {active_python}\n"
        "Install them with:\n"
        f"  {active_python} -m pip install --upgrade "
        "google-api-python-client google-auth-httplib2 google-auth-oauthlib"
    ) from exc

SCOPES = ["https://www.googleapis.com/auth/forms.body"]
SCRIPT_DIR = Path(__file__).resolve().parent


def resolve_local_path(env_name: str, default_name: str) -> Path:
    override = os.environ.get(env_name)
    if override:
        return Path(override).expanduser().resolve()
    return SCRIPT_DIR / default_name


TOKEN_FILE = resolve_local_path("GOOGLE_FORMS_TOKEN_FILE", "token.json")
CREDENTIALS_FILE = resolve_local_path("GOOGLE_FORMS_CREDENTIALS_FILE", "credentials.json")
CREATED_FORMS_FILE = resolve_local_path("GOOGLE_FORMS_METADATA_FILE", "created_forms.json")
APPS_SCRIPT_HELPER_FILE = resolve_local_path(
    "GOOGLE_FORMS_APPS_SCRIPT_HELPER_FILE",
    "link_form_responses_to_sheets.gs",
)

# Behavior toggles
PUBLISH_FORMS = True
PRE_FINAL_AS_QUIZZES = False
STATION_AS_QUIZ = False


INTRO_TEXT = (
    "This survey evaluates the learning activity, not you. "
    "Your responses do not affect your grade. Please answer honestly. "
    "If anything in XR feels uncomfortable, raise your hand and we will help you stop immediately."
)


def get_credentials() -> Credentials:
    """Load or create OAuth credentials."""
    creds = None
    if TOKEN_FILE.exists():
        creds = Credentials.from_authorized_user_file(TOKEN_FILE, SCOPES)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            if not CREDENTIALS_FILE.exists():
                raise FileNotFoundError(
                    f"Missing credentials file at {CREDENTIALS_FILE}. Download your "
                    "Desktop OAuth client JSON from Google Cloud and place it next to "
                    "this script, or set GOOGLE_FORMS_CREDENTIALS_FILE to point to it."
                )
            flow = InstalledAppFlow.from_client_secrets_file(CREDENTIALS_FILE, SCOPES)
            creds = flow.run_local_server(port=0)
        TOKEN_FILE.parent.mkdir(parents=True, exist_ok=True)
        with TOKEN_FILE.open("w", encoding="utf-8") as f:
            f.write(creds.to_json())

    return creds


def forms_service():
    """Build the Google Forms API client."""
    creds = get_credentials()
    return build("forms", "v1", credentials=creds, static_discovery=False)


def text_question(
    title: str,
    required: bool = True,
    paragraph: bool = False,
    description: Optional[str] = None,
) -> Dict[str, Any]:
    item: Dict[str, Any] = {
        "title": title,
        "questionItem": {
            "question": {
                "required": required,
                "textQuestion": {
                    "paragraph": paragraph,
                },
            }
        },
    }
    if description:
        item["description"] = description
    return item


def choice_question(
    title: str,
    options: List[str],
    required: bool = True,
    correct_answer: Optional[str] = None,
    point_value: int = 1,
    shuffle: bool = False,
    description: Optional[str] = None,
) -> Dict[str, Any]:
    question: Dict[str, Any] = {
        "required": required,
        "choiceQuestion": {
            "type": "RADIO",
            "options": [{"value": opt} for opt in options],
            "shuffle": shuffle,
        },
    }

    if correct_answer is not None:
        question["grading"] = {
            "pointValue": point_value,
            "correctAnswers": {"answers": [{"value": correct_answer}]},
        }

    item: Dict[str, Any] = {
        "title": title,
        "questionItem": {"question": question},
    }
    if description:
        item["description"] = description
    return item


def scale_question(
    title: str,
    low: int,
    high: int,
    low_label: str,
    high_label: str,
    required: bool = True,
) -> Dict[str, Any]:
    return {
        "title": title,
        "questionItem": {
            "question": {
                "required": required,
                "scaleQuestion": {
                    "low": low,
                    "high": high,
                    "lowLabel": low_label,
                    "highLabel": high_label,
                },
            }
        },
    }


def page_break(title: str, description: Optional[str] = None) -> Dict[str, Any]:
    item: Dict[str, Any] = {
        "title": title,
        "pageBreakItem": {},
    }
    if description:
        item["description"] = description
    return item


def build_batch_requests(
    *,
    description: str,
    items: List[Dict[str, Any]],
    make_quiz: bool = False,
) -> Dict[str, Any]:
    requests: List[Dict[str, Any]] = [
        {
            "updateFormInfo": {
                "info": {"description": description},
                "updateMask": "description",
            }
        }
    ]

    if make_quiz:
        requests.append(
            {
                "updateSettings": {
                    "settings": {"quizSettings": {"isQuiz": True}},
                    "updateMask": "quizSettings.isQuiz",
                }
            }
        )

    for index, item in enumerate(items):
        requests.append(
            {
                "createItem": {
                    "item": item,
                    "location": {"index": index},
                }
            }
        )

    return {"requests": requests}


def create_blank_form(service, title: str, unpublished: bool = True) -> Dict[str, Any]:
    return (
        service.forms()
        .create(
            body={"info": {"title": title, "documentTitle": title}},
            unpublished=unpublished,
        )
        .execute()
    )


def update_form(service, form_id: str, body: Dict[str, Any]) -> Dict[str, Any]:
    return service.forms().batchUpdate(formId=form_id, body=body).execute()


def publish_form(service, form_id: str) -> Dict[str, Any]:
    body = {
        "publishSettings": {
            "publishState": {
                "isPublished": True,
                "isAcceptingResponses": True,
            }
        },
        "updateMask": "publishState",
    }
    return service.forms().setPublishSettings(formId=form_id, body=body).execute()


def get_form(service, form_id: str) -> Dict[str, Any]:
    return service.forms().get(formId=form_id).execute()


def build_pre_lesson_items(make_quiz: bool) -> List[Dict[str, Any]]:
    items: List[Dict[str, Any]] = [
        text_question("Student ID", required=True, paragraph=False),
        choice_question(
            "Have you used a VR, AR, or XR headset before?",
            ["No", "Once or twice", "A few times", "Often"],
            required=True,
        ),
        scale_question(
            "Before today, how familiar were you with virus capsids and symmetry?",
            1,
            7,
            "Not at all familiar",
            "Very familiar",
            required=True,
        ),
        scale_question(
            "Before today, how confident were you in learning biology concepts from 3D models?",
            1,
            7,
            "Not at all confident",
            "Very confident",
            required=True,
        ),
        page_break("Baseline knowledge quiz"),
    ]

    quiz_questions = [
        (
            "A capsid is best described as:",
            ["A protective protein shell", "Viral DNA only", "A host cell membrane", "A microscope image"],
            "A protective protein shell",
        ),
        (
            "In the simplest icosahedral shell (T = 1), the shell is built from:",
            ["12 identical subunits", "20 identical subunits", "60 equivalent subunits", "120 unique subunits"],
            "60 equivalent subunits",
        ),
        (
            "A 5-fold symmetry axis means that the object looks the same after a rotation of:",
            ["30°", "60°", "72°", "120°"],
            "72°",
        ),
        (
            "Which change allows a flat hexagonal lattice to curve and close into a shell?",
            ["Removing all pentagons", "Replacing 12 hexagons with pentagons", "Adding only triangles", "Doubling the genome length"],
            "Replacing 12 hexagons with pentagons",
        ),
        (
            "Compared with a T = 1 shell, a larger T-number generally means:",
            ["Less capacity and fewer environments", "More capacity and more quasi-equivalent environments", "No change in size", "Loss of symmetry"],
            "More capacity and more quasi-equivalent environments",
        ),
        (
            "Which axis passes through the center of a triangular face of an icosahedral object?",
            ["2-fold", "3-fold", "5-fold", "None"],
            "3-fold",
        ),
        (
            "Which statement is true of membrane viruses such as influenza, HIV, or SARS-CoV-2?",
            [
                "They are always pure protein shells only",
                "They may include a lipid envelope and surface proteins",
                "They have no repeating protein components",
                "They cannot be modeled in 3D",
            ],
            "They may include a lipid envelope and surface proteins",
        ),
        (
            "Viral capsid self-assembly is best described as:",
            [
                "A central builder places each part by hand",
                "Repeated subunits assemble through local interactions and geometry",
                "Random growth with no structural rules",
                "Copying of a host cell nucleus",
            ],
            "Repeated subunits assemble through local interactions and geometry",
        ),
    ]

    for title, options, correct in quiz_questions:
        items.append(
            choice_question(
                title,
                options,
                required=True,
                correct_answer=correct if make_quiz else None,
                point_value=1,
            )
        )

    return items


def build_station_items(make_quiz: bool) -> List[Dict[str, Any]]:
    items: List[Dict[str, Any]] = [
        text_question("Student ID", required=True, paragraph=False),
        choice_question(
            "Which station did you just complete?",
            ["XR lesson", "3D printed table activity"],
            required=True,
        ),
        choice_question(
            "Start order",
            ["XR first", "Table first", "CellPAINT first / other"],
            required=True,
        ),
    ]

    scale_items = [
        "This activity helped me understand how repeated protein subunits can build a virus shell.",
        "After this activity, I could better identify major symmetry features such as 2-fold, 3-fold, and 5-fold axes.",
        "This activity helped me understand how larger T-numbers relate to larger or more complex capsids.",
        "I would feel comfortable explaining one key idea from this activity to another student.",
        "It was easy to tell what I was supposed to do next during the activity.",
        "The interaction felt natural for the learning task.",
        "The amount of information was manageable.",
        "This activity required a lot of mental effort.",
        "I felt physically comfortable during this activity.",
    ]

    for title in scale_items:
        items.append(
            scale_question(
                title,
                1,
                7,
                "Strongly disagree",
                "Strongly agree",
                required=True,
            )
        )

    items.append(
        choice_question(
            "Immediate transfer item: Which feature is essential for closing a curved capsid shell from a hexagonal lattice?",
            ["Only hexagons", "12 pentagons", "Only triangles", "Extra RNA"],
            required=True,
            correct_answer="12 pentagons" if make_quiz else None,
            point_value=1,
        )
    )

    items.append(
        text_question(
            "Optional comment: What helped you most or confused you most in this station?",
            required=False,
            paragraph=True,
        )
    )

    return items


def build_final_items(make_quiz: bool) -> List[Dict[str, Any]]:
    items: List[Dict[str, Any]] = [
        text_question("Student ID", required=True, paragraph=False),
        choice_question(
            "Start order",
            ["XR first", "Table first", "CellPAINT first / other"],
            required=True,
        ),
        page_break("Final knowledge quiz"),
    ]

    # Same 8 knowledge questions as the pre-form, but in a different order.
    shuffled_quiz_questions = [
        (
            "Which statement is true of membrane viruses such as influenza, HIV, or SARS-CoV-2?",
            [
                "They are always pure protein shells only",
                "They may include a lipid envelope and surface proteins",
                "They have no repeating protein components",
                "They cannot be modeled in 3D",
            ],
            "They may include a lipid envelope and surface proteins",
        ),
        (
            "Which axis passes through the center of a triangular face of an icosahedral object?",
            ["2-fold", "3-fold", "5-fold", "None"],
            "3-fold",
        ),
        (
            "A capsid is best described as:",
            ["A protective protein shell", "Viral DNA only", "A host cell membrane", "A microscope image"],
            "A protective protein shell",
        ),
        (
            "Compared with a T = 1 shell, a larger T-number generally means:",
            ["Less capacity and fewer environments", "More capacity and more quasi-equivalent environments", "No change in size", "Loss of symmetry"],
            "More capacity and more quasi-equivalent environments",
        ),
        (
            "A 5-fold symmetry axis means that the object looks the same after a rotation of:",
            ["30°", "60°", "72°", "120°"],
            "72°",
        ),
        (
            "Viral capsid self-assembly is best described as:",
            [
                "A central builder places each part by hand",
                "Repeated subunits assemble through local interactions and geometry",
                "Random growth with no structural rules",
                "Copying of a host cell nucleus",
            ],
            "Repeated subunits assemble through local interactions and geometry",
        ),
        (
            "In the simplest icosahedral shell (T = 1), the shell is built from:",
            ["12 identical subunits", "20 identical subunits", "60 equivalent subunits", "120 unique subunits"],
            "60 equivalent subunits",
        ),
        (
            "Which change allows a flat hexagonal lattice to curve and close into a shell?",
            ["Removing all pentagons", "Replacing 12 hexagons with pentagons", "Adding only triangles", "Doubling the genome length"],
            "Replacing 12 hexagons with pentagons",
        ),
    ]

    for title, options, correct in shuffled_quiz_questions:
        items.append(
            choice_question(
                title,
                options,
                required=True,
                correct_answer=correct if make_quiz else None,
                point_value=1,
            )
        )

    items.append(page_break("Direct comparison"))

    comparison_questions = [
        (
            "Which activity helped you understand symmetry axes better?",
            ["XR", "Table", "About the same"],
        ),
        (
            "Which activity made the interaction feel more natural?",
            ["XR", "Table", "About the same"],
        ),
        (
            "Which activity made it easier to understand capsid assembly?",
            ["XR", "Table", "About the same"],
        ),
        (
            "Which activity would you most want to keep in the class?",
            ["XR", "Table", "Both are essential"],
        ),
    ]

    for title, options in comparison_questions:
        items.append(choice_question(title, options, required=True))

    items.append(
        scale_question(
            "Overall, how much did the full lesson improve your understanding of virus structure?",
            1,
            7,
            "Not at all",
            "Very much",
            required=True,
        )
    )
    items.append(
        text_question(
            "In one or two sentences, describe which modality helped you most and why.",
            required=False,
            paragraph=True,
        )
    )

    return items


def create_study_form(
    service,
    *,
    title: str,
    description: str,
    items: List[Dict[str, Any]],
    make_quiz: bool,
) -> Dict[str, Any]:
    created = create_blank_form(service, title, unpublished=True)
    form_id = created["formId"]

    batch_body = build_batch_requests(
        description=description,
        items=items,
        make_quiz=make_quiz,
    )
    update_form(service, form_id, batch_body)

    if PUBLISH_FORMS:
        publish_form(service, form_id)

    current = get_form(service, form_id)
    return {
        "title": title,
        "formId": form_id,
        "editUrl": f"https://docs.google.com/forms/d/{form_id}/edit",
        "responderUrl": current.get("responderUri"),
        "isQuiz": make_quiz,
    }


def build_response_sheet_bindings(created_forms: Dict[str, Dict[str, Any]]) -> List[Dict[str, str]]:
    return [
        {
            "key": key,
            "title": form["title"],
            "formId": form["formId"],
            "sheetTitle": f"{form['title']} Responses",
        }
        for key, form in created_forms.items()
    ]


def write_apps_script_sheet_helper(created_forms: Dict[str, Dict[str, Any]]) -> Path:
    bindings = json.dumps(build_response_sheet_bindings(created_forms), indent=2)
    script_source = f"""const FORM_SHEET_BINDINGS = {bindings};

function createResponseSheetsAndLink() {{
  const results = FORM_SHEET_BINDINGS.map((binding) => {{
    const form = FormApp.openById(binding.formId);
    const spreadsheet = SpreadsheetApp.create(binding.sheetTitle);

    form.setDestination(FormApp.DestinationType.SPREADSHEET, spreadsheet.getId());

    return {{
      key: binding.key,
      title: binding.title,
      formId: binding.formId,
      sheetId: spreadsheet.getId(),
      sheetTitle: spreadsheet.getName(),
      sheetUrl: spreadsheet.getUrl(),
    }};
  }});

  console.log(JSON.stringify(results, null, 2));
  return results;
}}
"""
    APPS_SCRIPT_HELPER_FILE.parent.mkdir(parents=True, exist_ok=True)
    APPS_SCRIPT_HELPER_FILE.write_text(script_source, encoding="utf-8")
    return APPS_SCRIPT_HELPER_FILE


def main() -> None:
    if CREATED_FORMS_FILE.exists() and os.environ.get("GOOGLE_FORMS_ALLOW_RERUN") != "1":
        raise FileExistsError(
            f"{CREATED_FORMS_FILE} already exists. Refusing to create a second set of "
            "published forms by default. Remove that file or set "
            "GOOGLE_FORMS_ALLOW_RERUN=1 if you intentionally want a fresh set."
        )

    service = forms_service()

    pre_form = create_study_form(
        service,
        title="XR Lesson Study: Pre-Lesson Survey",
        description=(
            "Please enter your anonymous student ID. "
            + INTRO_TEXT
        ),
        items=build_pre_lesson_items(make_quiz=PRE_FINAL_AS_QUIZZES),
        make_quiz=PRE_FINAL_AS_QUIZZES,
    )

    station_form = create_study_form(
        service,
        title="XR Lesson Study: Station Survey",
        description=(
            "Complete this immediately after the station you just finished. "
            + INTRO_TEXT
        ),
        items=build_station_items(make_quiz=STATION_AS_QUIZ),
        make_quiz=STATION_AS_QUIZ,
    )

    final_form = create_study_form(
        service,
        title="XR Lesson Study: Final Comparison Survey",
        description=(
            "Please complete this at the end of the full lesson. "
            + INTRO_TEXT
        ),
        items=build_final_items(make_quiz=PRE_FINAL_AS_QUIZZES),
        make_quiz=PRE_FINAL_AS_QUIZZES,
    )

    created_forms = {
        "pre_form": pre_form,
        "station_form": station_form,
        "final_form": final_form,
    }

    CREATED_FORMS_FILE.parent.mkdir(parents=True, exist_ok=True)
    with CREATED_FORMS_FILE.open("w", encoding="utf-8") as f:
        json.dump(created_forms, f, indent=2)

    helper_path = write_apps_script_sheet_helper(created_forms)

    print("\nCreated forms:\n")
    for key, form in created_forms.items():
        print(f"{key}:")
        print(f"  Title       : {form['title']}")
        print(f"  Form ID     : {form['formId']}")
        print(f"  Edit URL    : {form['editUrl']}")
        print(f"  Responder URL: {form['responderUrl']}")
        print(f"  Is quiz     : {form['isQuiz']}")
        print()

    print(f"Saved metadata to {CREATED_FORMS_FILE}")
    print(
        "Wrote an Apps Script helper for linking Google Sheets response destinations to "
        f"{helper_path}"
    )


if __name__ == "__main__":
    try:
        main()
    except HttpError as e:
        print("Google API error:")
        print(e)
        raise
