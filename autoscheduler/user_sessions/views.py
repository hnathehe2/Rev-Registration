from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.contrib.auth.models import User
from django.contrib.auth import logout
from django.shortcuts import redirect
from django.contrib.sessions.backends.db import SessionStore


def get_data_session_object(request): #NEEDS TESTS
    """ Upon login, data_session_key is stored in request.session. All data
        that should persist across login/outs and computers should be stored
        in the session object corresponding to data_session_key. This function
        retrieves this object for use in the APIs.
    """
    data_session_key = request.session['data_session_key']
    data_session_object = SessionStore(session_key=data_session_key)
    return data_session_object

@api_view(['GET'])
def get_last_term(request):
    """ View that returns JSON containing last term for the current user's session.
        Used by landing page to determine whether to redirect to schedules. """
    term = request.session.setdefault('term', '')
    response = {'term': term}
    return Response(response)

@api_view(['PUT'])
def set_last_term(request):
    """ View that sets term for the current session. Called when a term is selected,
        or when the title bar is clicked to unset last term.
    """
    term = request.query_params.get('term')
    # empty string term is valid (used to unset term), so explicitly check for None
    if term is None:
        return Response(status=400)
    request.session['term'] = term
    return Response()

@api_view(['GET'])
def get_full_name(request):
    """ View that retrieves the first and last name seperated by a space for the user
    of the current session """
    user_id = request.session.get('_auth_user_id')
    if user_id is None:
        return Response(status=400)
    user = User.objects.get(pk=user_id)
    response = {'fullName': user.get_full_name()}
    return Response(response)

def logout_view(request):
    """ Logs out the user and redirects to index"""
    logout(request)
    return redirect('/')
