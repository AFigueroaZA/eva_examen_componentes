import { Component } from "react";
import SimpleReactValidator from "simple-react-validator";
import { Send, Upload, UserPlus } from "lucide-react";
import { isFirebaseConfigured } from "../firebaseConfig";
import { registerCustomer } from "../services/registrationService";

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  phone: "",
  address: "",
  comments: "",
};

export default class RegistrationForm extends Component {
  constructor(props) {
    super(props);

    this.validator = new SimpleReactValidator({
      className: "text-danger small mt-1 d-block",
      messages: {
        required: "Este campo es obligatorio.",
        email: "Ingresa un correo válido.",
        min: "Debe tener al menos :min caracteres.",
      },
      validators: {
        phone_cl: {
          message: "Ingresa un teléfono chileno válido.",
          rule: (value) => {
            const normalized = String(value).replace(/[\s-]/g, "");
            return /^(\+?56)?9?\d{8}$/.test(normalized);
          },
        },
        file_size: {
          message: "El archivo debe pesar hasta :max MB.",
          rule: (value, params) => {
            if (!value) {
              return true;
            }
            const maxMb = Number(params[0]);
            return value.size <= maxMb * 1024 * 1024;
          },
          messageReplace: (message, params) => message.replace(":max", params[0]),
        },
      },
    });

    this.state = {
      form: initialForm,
      avatarFile: null,
      isSubmitting: false,
      status: null,
    };
  }

  componentDidMount() {
    document.title = "Registro | Eva Store";
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState((prevState) => ({
      form: {
        ...prevState.form,
        [name]: value,
      },
    }));
  };

  handleFileChange = (event) => {
    this.setState({ avatarFile: event.target.files?.[0] || null });
  };

  handleSubmit = async (event) => {
    event.preventDefault();

    if (!this.validator.allValid()) {
      this.validator.showMessages();
      this.forceUpdate();
      return;
    }

    this.setState({
      isSubmitting: true,
      status: null,
    });

    try {
      const result = await registerCustomer(this.state.form, this.state.avatarFile);
      this.setState({
        form: initialForm,
        avatarFile: null,
        isSubmitting: false,
        status: {
          type: "success",
          message:
            result.mode === "firebase"
              ? `Registro guardado en Firebase con ID ${result.id}.`
              : "Firebase no está configurado. Registro guardado en modo demo local.",
        },
      });
      this.validator.hideMessages();
      event.target.reset();
    } catch (error) {
      this.setState({
        isSubmitting: false,
        status: {
          type: "danger",
          message: `No se pudo guardar el registro: ${error.message}`,
        },
      });
    }
  };

  render() {
    const { form, avatarFile, isSubmitting, status } = this.state;

    return (
      <main className="form-page">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-xl-10">
              <div className="row g-4 align-items-stretch">
                <div className="col-lg-4">
                  <section className="info-panel bg-primary text-white h-100">
                    <UserPlus size={36} aria-hidden="true" />
                    <h1 className="h2 mt-4">Crea tu cuenta</h1>
                    <p className="mb-4">
                      Completa tus datos para crear tu cuenta. Si adjuntas un
                      comprobante, lo guardaremos junto con tu registro.
                    </p>
                    <div className="small opacity-75">
                      Estado: {isFirebaseConfigured ? "Firebase activo" : "modo demo local"}
                    </div>
                  </section>
                </div>

                <div className="col-lg-8">
                  <form className="form-card bg-white border" onSubmit={this.handleSubmit}>
                    {status && (
                      <div className={`alert alert-${status.type}`} role="alert">
                        {status.message}
                      </div>
                    )}

                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label" htmlFor="firstName">
                          Nombre
                        </label>
                        <input
                          className="form-control"
                          id="firstName"
                          name="firstName"
                          type="text"
                          value={form.firstName}
                          onChange={this.handleChange}
                        />
                        {this.validator.message("nombre", form.firstName, "required|min:2")}
                      </div>

                      <div className="col-md-6">
                        <label className="form-label" htmlFor="lastName">
                          Apellido
                        </label>
                        <input
                          className="form-control"
                          id="lastName"
                          name="lastName"
                          type="text"
                          value={form.lastName}
                          onChange={this.handleChange}
                        />
                        {this.validator.message("apellido", form.lastName, "required|min:2")}
                      </div>

                      <div className="col-md-6">
                        <label className="form-label" htmlFor="email">
                          Correo
                        </label>
                        <input
                          className="form-control"
                          id="email"
                          name="email"
                          type="email"
                          value={form.email}
                          onChange={this.handleChange}
                        />
                        {this.validator.message("correo", form.email, "required|email")}
                      </div>

                      <div className="col-md-6">
                        <label className="form-label" htmlFor="password">
                          Clave
                        </label>
                        <input
                          className="form-control"
                          id="password"
                          name="password"
                          type="password"
                          value={form.password}
                          onChange={this.handleChange}
                        />
                        {this.validator.message("clave", form.password, "required|min:6")}
                      </div>

                      <div className="col-md-6">
                        <label className="form-label" htmlFor="phone">
                          Teléfono
                        </label>
                        <input
                          className="form-control"
                          id="phone"
                          name="phone"
                          placeholder="+56 9 1234 5678"
                          type="tel"
                          value={form.phone}
                          onChange={this.handleChange}
                        />
                        {this.validator.message("telefono", form.phone, "required|phone_cl")}
                      </div>

                      <div className="col-md-6">
                        <label className="form-label" htmlFor="avatar">
                          Imagen o comprobante
                        </label>
                        <label className="upload-control" htmlFor="avatar">
                          <Upload size={18} aria-hidden="true" />
                          {avatarFile ? avatarFile.name : "Seleccionar archivo"}
                        </label>
                        <input
                          className="visually-hidden"
                          id="avatar"
                          name="avatar"
                          type="file"
                          accept="image/*,.pdf"
                          onChange={this.handleFileChange}
                        />
                        {this.validator.message("archivo", avatarFile, "file_size:2")}
                      </div>

                      <div className="col-12">
                        <label className="form-label" htmlFor="address">
                          Dirección
                        </label>
                        <input
                          className="form-control"
                          id="address"
                          name="address"
                          type="text"
                          value={form.address}
                          onChange={this.handleChange}
                        />
                        {this.validator.message("direccion", form.address, "required|min:5")}
                      </div>

                      <div className="col-12">
                        <label className="form-label" htmlFor="comments">
                          Comentarios
                        </label>
                        <textarea
                          className="form-control"
                          id="comments"
                          name="comments"
                          rows="4"
                          value={form.comments}
                          onChange={this.handleChange}
                        />
                        {this.validator.message("comentarios", form.comments, "required|min:10")}
                      </div>
                    </div>

                    <div className="d-flex justify-content-end mt-4">
                      <button
                        className="btn btn-primary d-inline-flex align-items-center gap-2"
                        type="submit"
                        disabled={isSubmitting}
                      >
                        <Send size={18} aria-hidden="true" />
                        {isSubmitting ? "Guardando..." : "Guardar registro"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
}
