/* eslint-disable @typescript-eslint/no-unused-vars */
import { Form, Formik } from "formik";
import { Fragment } from "react";
import { Link } from "react-router-dom";
import { object, ref, string } from "yup";
import { FormInput } from "../components";
import { mainPath } from "../router";
import { useAppDispatch, useAppSelector, userRegister } from "../store";
import { generateFormFieldsSchema, getInitialValues } from "../utils";

interface Values {
  name: string;
  email: string;
  password: string;
  repeatPassword: string;
}

const customForm = [
  {
    name: "name",
    id: "name",
    type: "text",
    required: true,
    minLength: 3,
    maxLength: 50,
    label: "Name",
    value: "",
  },
  {
    name: "email",
    id: "email",
    type: "email",
    required: true,
    label: "Email",
    value: "",
  },
  {
    name: "password",
    id: "password",
    type: "password",
    required: true,
    minLength: 6,
    label: "Password",
    value: "",
  },
  {
    name: "repeatPassword",
    id: "repeatPassword",
    type: "password",
    required: true,
    minLength: 6,
    label: "Repeat Password",
    value: "",
  },
];

const initialValues: Values = getInitialValues(customForm);

const validationFields = generateFormFieldsSchema(customForm);

const validationSchema = object({
  ...validationFields,
  password: string()
    .required("Password is required")
    .min(8, "Password is too short")
    .max(50, "Password is too long"),
  repeatPassword: string()
    .required("Repeat Password is required")
    .oneOf([ref("password")], "Passwords must match")

});


export const RegisterScreen = () => {

  const { loading } = useAppSelector(({ auth }) => auth);

  const dispatch = useAppDispatch();

  const handleSubmit = ({ email, password, name }: Values) => {

    dispatch(userRegister({
      email,
      password,
      name
    }));


  }

  return (
    <>

      <h3
        className="auth__title"
      >
        Register
      </h3>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        {({ isValid }) => (
          <Form
            className="animate__animated animate__fadeIn animate__faster"
          >
            {customForm.map(({ value, ...field }, index) => <Fragment
              key={field.id + field.name + index}
            >
              <FormInput
                {...field}
                className="auth__input"
                ErrorMessageFP={{
                  className: "has-error",
                  name: field.name,
                }}

              />
              <br className="mb-1" />
            </Fragment>)}
            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={loading || !isValid}
            >Sign Up</button>
          </Form>
        )}
      </Formik>
      <hr
        className="my-1"
      />
      <Link
        to={`${mainPath}auth/login`}
        title="Create new account"
        className="link"
      >
        Already registered?
      </Link>
    </>
  );
};
