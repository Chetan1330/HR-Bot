# This files contains your custom actions which can be used to run
# custom Python code.
#
# See this guide on how to implement these action:
# https://rasa.com/docs/rasa/custom-actions


# This is a simple example for a custom action which utters "Hello World!"

from typing import Any, Text, Dict, List
#
import requests
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk import Tracker, FormValidationAction
from rasa_sdk.types import DomainDict
from rasa_sdk.events import SlotSet,FollowupAction
import re
import random
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'

#
# url ="http://localhost:8000/api/"
url ="http://web:8000/api/"
def sendOTP(email):
    a= random.randint(100,1000)
    message = Mail(
    from_email='test@roycetechnologies.co.ke',
    to_emails=email,
    subject='OTP',
    html_content=f'Your OTP is: {a}')
    try:
        sg = SendGridAPIClient("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")
        response = sg.send(message)
        # print(response.status_code)
        # print(response.body)
        # print(response.headers)
    except Exception as e:
        print(e.message)

    return a

class ValidateOnboardingForm(FormValidationAction):

    def name(self) -> Text:
        return "validate_onboarding_form"

    def validate_email(
        self,
        slot_value: Any,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        """Validate cuisine value."""

        if(re.fullmatch(regex, slot_value)):
            print("Valid Email")
            
            return {"email": slot_value}
            
            
 
        else:
            print("Invalid Email")
            dispatcher.utter_message(text="Please enter a valid email")
            return {"email": None}
    def validate_email_otp(
        self,
        slot_value: Any,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        gen=tracker.get_slot('generated_otp')
        print(f"Slot Value{slot_value}")
        print(f"Generated{gen}")
        if(tracker.get_slot('generated_otp')==slot_value):
            print('valid OTP')
        else:

            print("Invalid OTP")
        
class ActionSubmitOnboarding(Action):

    def name(self) -> Text:
        return "action_create_account"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        print("Create an account")
        firstname=tracker.get_slot('firstname')
        email=tracker.get_slot('email')
        othernames=tracker.get_slot('othernames')
        phonenumber=tracker.get_slot('phonenumber')
        experience=tracker.get_slot('experience')
        skills=tracker.get_slot('skills')
        videolink=tracker.get_slot('videolink')
        data={
            "email":email,
            "first_name":firstname,
            "other_names":othernames,
            "phone_number":phonenumber,
            "experience":experience,
            "skills":skills,
            "videolink":videolink
        }

        res=requests.post(url+"botregister",json=data).json()
        if res['status']==0:
            dispatcher.utter_message(text=f"hello {firstname}, You have already registered")
        else:
            # SlotSet('vid_link',res['link'])
            dispatcher.utter_message(text="successful")
            dispatcher.utter_message(text=res['link'])
            
            

        

        return []
class ActionSubmitOnboarding(Action):

    def name(self) -> Text:
        return "action_submit_onboarding_form"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        
        b=sendOTP(tracker.get_slot('email'))
        print(f"From send OTP{b}")
        ev=SlotSet('generated_otp',b)
        ev2=SlotSet('email_otp',None)

        return [ev,ev2,FollowupAction('verify_otp_form')]
class ActionSubmitVerifyOtpForm(Action):

    def name(self) -> Text:
        return "action_change_email"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        print("Change Email")
        evt= SlotSet('email',None)
        evt2= SlotSet('generated_otp',None)

        return [evt, FollowupAction('onboarding_form')]
class ActionSubmitVerifyOtpForm(Action):

    def name(self) -> Text:
        return "action_submit_verify_otp_form"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        generated_otp=tracker.get_slot('generated_otp')
        email_otp=tracker.get_slot('email_otp')

        print(f"Generated {generated_otp} entered {email_otp}")

        if(int(generated_otp)!=int(email_otp)):

            print("wrong OTP")
            dispatcher.utter_message(response="utter_wrong_otp")
            
        else:
            print("right OTP")
            
            dispatcher.utter_message(text="register")
            
        

        return []
