import FormAuth from "../../components/FormAuth";
import { Button, Form } from "react-bootstrap";
import { useFormik} from "formik";
import * as Yup from "yup"

export default function Adminlogin () {
    const schema = Yup.object({
        email: Yup.string().required("Email harus diisi").email("Format email salah"),
        password: Yup.string().required("Password harus diisi").matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/, "Minimal 6 karakter, satu huruf besar dan satu angka")
    })
    
    const initialForm = {
        email: "",
        password: "",
    }

    function onSubmitForm(values) {
        console.log("INI", values)
    }

    const Formik = useFormik({
        initialValues: initialForm,
        validationSchema: schema,
        onSubmit: onSubmitForm
    })
    return (
        <main id="container__login__admin" className="d-flex justify-content-center align-items-center min-vh-100">
                <FormAuth title="Masuk ke Dashboard" subTitle="Masukkan Email dan Password Admin">
                    <Form onSubmit={Formik.handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Control type="email" placeholder="Email" className=" border-secondary" name="email" value={Formik.values.email} onChange={Formik.handleChange} isInvalid={!!Formik.errors.email} />
                            <Form.Control.Feedback type="invalid" >
                                {Formik.errors.email}
                            </Form.Control.Feedback>
                            </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Control type="password" placeholder="Password" className=" border-secondary" name="password" value={Formik.values.password} onChange={Formik.handleChange} isInvalid={!!Formik.errors.password} />
                            <Form.Control.Feedback type="invalid" >
                                {Formik.errors.password}
                            </Form.Control.Feedback>
                        </Form.Group>

                            <Button variant="dark" type="submit" className=" w-100">Masuk</Button>
                    </Form>
                </FormAuth>
        </main>
    )
}