import React from 'react';
import { Global } from '@emotion/core';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory,
} from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Routes } from 'constants/Routes';

import { StateProvider } from 'state/StateProvider';
import { useAuth } from 'hooks/useAuth';

import NewSupplyRequest from 'pages/supplies_new';
import NewSupplyRequestConfirmation from 'pages/supplies_new_confirmation';
import AdminDropSite from 'pages/dropsite_admin';
import ContactDropSite from 'pages/dropsite_contact';
import ContactDropSiteConfirmation from 'pages/dropsite_contact_confirmation';
import NewFacility from 'pages/facility_new';
import FacilityConfirmation from 'pages/facility_confirmation';
import FacilityEdit from 'pages/facility_edit';
import NewDropSite from 'pages/dropsite_new';
import Request from 'pages/request';

// MVP
import EntryPortal from 'pages/entry';
import SignUp from 'pages/signup';
import SignUpConfirmation from 'pages/signup_confirmation';
import SignupFinish from 'pages/signup_approve';
import Contact from 'pages/contact';
import ContactConfirmation from 'pages/contact_confirmation';
import ServiceType from 'pages/service_type';
// End MVP

import HCPSignupFinish from 'components/HCPSignupFinish';
import DropSite from 'components/DropSite';
import PendingDomains from 'components/PendingDomains';
import NoMatch from 'components/NoMatch';
import Login from 'components/Login';
import Logout from 'components/Logout';
import Profile from 'components/Profile';
import StyleGuide from 'components/StyleGuide/index';
import Box from 'components/Box';
import InvalidEmail from 'components/Alert/InvalidEmail';
import Loading from 'components/Loading';

import { styles } from './App.styles';

const ProtectedRoute = ({ backend, children, path }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [badDomain, setBadDomain] = useState(false);
  const { isInitializing, isLoggedIn } = useAuth();

  const checkValid = useCallback(() => {
    backend.isValidHealthcareWorker().then((verified) => {
      setLoading(false);
      setVerified(verified);

      if (!verified) {
        setBadDomain(backend.badDomain);
      }
    });
  }, [backend]);

  useEffect(() => {
    if (isInitializing) {
      return;
    }

    if (!isInitializing && !isLoggedIn) {
      history.push(Routes.HOME);
      return;
    }

    checkValid();
  }, [isInitializing, isLoggedIn, checkValid, history]);

  let content = <Route path={path}>{children}</Route>;
  if (loading) {
    content = (
      <Box>
        <Loading message={t('login.loading.message')} />
      </Box>
    );
  }

  // TODO: check if this accounts for mismatched validation, ie email does not match facility
  if (!verified && badDomain) {
    content = (
      <Box>
        <InvalidEmail />
      </Box>
    );
  }

  return content;
};

function App({ backend }) {
  return (
    <StateProvider>
      <Global styles={styles} />
      <Router>
        <div className="App">
          <Switch>
            {/*MVP Routes*/}
            <Route exact path={Routes.HOME}>
              <EntryPortal backend={backend} />
            </Route>
            <Route exact path={Routes.EMAIL_FORM}>
              <SignUp backend={backend} />
            </Route>
            <Route exact path={Routes.EMAIL_SENT}>
              <SignUpConfirmation backend={backend} />
            </Route>
            <Route exact path={Routes.EMAIL_APPROVE}>
              <SignupFinish backend={backend} />
            </Route>
            <ProtectedRoute backend={backend} exact path={Routes.CONTACT_FORM}>
              <Contact backend={backend} />
            </ProtectedRoute>
            <ProtectedRoute
              backend={backend}
              exact
              path={Routes.CONTACT_CONFIRMATION}
            >
              <ContactConfirmation backend={backend} />
            </ProtectedRoute>
            <ProtectedRoute backend={backend} exact path={Routes.SERVICE_TYPE}>
              <ServiceType backend={backend} />
            </ProtectedRoute>
            <Route path="*">
              <NoMatch />
            </Route>
            {/*END MVP Routes*/}

            <Route path={Routes.LOGIN}>
              <Login />
            </Route>
            <Route path={Routes.LOGOUT}>
              <Logout backend={backend} />
            </Route>
            <ProtectedRoute
              backend={backend}
              exact
              path={Routes.DROPSITE_CONTACT}
            >
              <ContactDropSite backend={backend} />
            </ProtectedRoute>
            <ProtectedRoute
              backend={backend}
              exact
              path={Routes.DROPSITE_CONTACT_CONFIRMATION}
            >
              <ContactDropSiteConfirmation backend={backend} />
            </ProtectedRoute>
            <ProtectedRoute backend={backend} path={Routes.DROPSITE_NEW_ADMIN}>
              <NewDropSite backend={backend} />
            </ProtectedRoute>
            <ProtectedRoute
              exact
              backend={backend}
              path={Routes.SUPPLY_NEW_ADMIN}
            >
              <NewSupplyRequest backend={backend} />
            </ProtectedRoute>
            <ProtectedRoute
              exact
              backend={backend}
              path={Routes.SUPPLY_NEW_ADMIN_CONFIRMATION}
            >
              <NewSupplyRequestConfirmation backend={backend} />
            </ProtectedRoute>
            <Route path={Routes.SIGNUP_FINISH_DROPSITE}>
              <HCPSignupFinish backend={backend} />
            </Route>
            <ProtectedRoute backend={backend} path={Routes.DROPSITE_ADMIN}>
              <AdminDropSite backend={backend} />
            </ProtectedRoute>
            <Route path={Routes.DROPSITE_DETAIL}>
              <DropSite backend={backend} />
            </Route>
            <Route path={Routes.PROFILE}>
              <Profile backend={backend} />
            </Route>
            <Route path={Routes.PENDING_DOMAINS}>
              <PendingDomains backend={backend} />
            </Route>
            <Route exact path={Routes.STYLE_GUIDE}>
              <StyleGuide backend={backend} />
            </Route>
            <Route exact path={Routes.HOME}>
              <EntryPortal backend={backend} />
            </Route>
            <Route path={Routes.REQUEST_SUPPLIES}>
              <Request backend={backend} />
            </Route>
            <Route exact path={Routes.SIGNUP_DROPSITE}>
              <SignUp backend={backend} />
            </Route>
            <Route exact path={Routes.SIGNUP_DROPSITE_CONFIRMATION}>
              <SignUpConfirmation backend={backend} />
            </Route>
            <Route exact path={Routes.NEW_FACILITY}>
              <NewFacility backend={backend} />
            </Route>
            <Route exact path={Routes.FACILITY_CONFIRMATION}>
              <FacilityConfirmation backend={backend} />
            </Route>
            <ProtectedRoute exact path={Routes.FACILITY_EDIT} backend={backend}>
              <FacilityEdit backend={backend} />
            </ProtectedRoute>
          </Switch>
        </div>
      </Router>
    </StateProvider>
  );
}

export default App;
