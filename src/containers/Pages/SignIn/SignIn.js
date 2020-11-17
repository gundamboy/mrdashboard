import React from 'react';
import { Link, Redirect, useHistory, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import IntlMessages from '@iso/components/utility/intlMessages';
import SignInStyleWrapper from './SignIn.styles';
import {Form, Input, Button} from "antd";
import authAction from "@iso/redux/auth/actions";
import appAction from "@iso/redux/app/actions";

const { login } = authAction;
const { clearMenu } = appAction;

export default function SignIn() {
  let history = useHistory();
  let location = useLocation();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.Auth.idToken);
  const [redirectToReferrer, setRedirectToReferrer] = React.useState(false);

  React.useEffect(() => {
    if (isLoggedIn) {
      setRedirectToReferrer(true);
    }
  }, [isLoggedIn]);

  function handleLogin(formValues) {
    if (formValues) {
      dispatch(login(formValues));
    } else {
      dispatch(login());
    }
    dispatch(clearMenu());
    history.push('/dashboard');
  }
  let { from } = location.state || { from: { pathname: '/dashboard' } };

  if (redirectToReferrer) {
    return <Redirect to={from} />;
  }
  return (
    <SignInStyleWrapper className="isoSignInPage">
      <div className="isoLoginContentWrapper">
        <div className="isoLoginContent">
          <div className="isoLogoWrapper">
            <Link to="/dashboard">
              <IntlMessages id="page.signInTitle" />
            </Link>
          </div>
          <div className="isoSignInForm">
            <Form name="login-form" layout="vertical" onFinish={(values) => handleLogin(values)}>
              <div className="isoInputWrapper">
                <Form.Item
                    name={"email"}
                    className={"email"}
                >
                  <Input placeholder="Email" />
                </Form.Item>
              </div>

              <div className="isoInputWrapper">
                <Form.Item
                    name={"password"}
                    className={"password"}
                >
                  <Input type={"password"} placeholder="Password" />
                </Form.Item>
              </div>

              <div className="isoInputWrapper isoLeftRightComponent">
                <Button htmlType="submit" type="primary" size="default">
                  <IntlMessages id="page.signInButton" />
                </Button>
              </div>
            </Form>

            <div className="isoCenterComponent isoHelperWrapper">
              <Link to="/forgotpassword" className="isoForgotPass">
                <IntlMessages id="page.signInForgotPass" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </SignInStyleWrapper>
  );
}
