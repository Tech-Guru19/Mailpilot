import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    EditorProvider,
    Editor,
    Toolbar,
    BtnBold,
    BtnItalic,
    BtnUnderline,
    BtnStrikeThrough,
    BtnNumberedList,
    BtnBulletList,
    BtnLink,
    BtnUndo,
    BtnRedo,
    Separator,
} from "react-simple-wysiwyg";
import "./index.css";

export default function Email() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    const [fromRaw, setFromRaw] = useState("");
    const [toRaw, setToRaw] = useState("");
    const [ccRaw, setCcRaw] = useState("");
    const [bccRaw, setBccRaw] = useState("");
    const [subject, setSubject] = useState("");
    const [html, setHtml] = useState("");
    const [password, setPassword] = useState("");
    const [files, setFiles] = useState([]);
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState(null);
    const [sending, setSending] = useState(false);
    const [emailSent, setEmailSent] = useState(false); 
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const current = JSON.parse(localStorage.getItem("currentUser"));
        if (!current) navigate("/login");
        else setUser(current);
    }, [navigate]);

    const onFilesChange = (e) => setFiles(Array.from(e.target.files || []));
    const clearForm = () => {
        setFromRaw("");
        setToRaw("");
        setCcRaw("");
        setBccRaw("");
        setSubject("");
        setHtml("");
        setPassword("");
        setFiles([]);
        setErrors({});
        setStatus(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};
        if (!fromRaw.trim()) newErrors.from = "From is required";
        if (!toRaw.trim()) newErrors.to = "To is required";
        if (!subject.trim()) newErrors.subject = "Subject required";
        if (!html.trim()) newErrors.html = "Message required";
        if (password !== "11779904") newErrors.password = "Password is invalid";

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        setSending(true);
        setStatus({ type: "info", message: "Sending..." });

        try {
            const response = await fetch(`https://supply.queenainvestmentltd.com/mailer`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    from: fromRaw,
                    to: toRaw,
                    cc: ccRaw,
                    bcc: bccRaw,
                    subject,
                    html,
                }),
            });
            const serverResponse = await response.json();
            if (serverResponse.data?.id) {
                setStatus({ type: "success", message: "✅ Email sent successfully!" });
                setEmailSent(true); 
                clearForm();
            } else {
                setStatus({
                    type: "error",
                    message: `❌ Error: ${serverResponse.error || "Failed"}`,
                });
            }
        } catch (err) {
            setStatus({ type: "error", message: "❌ Network error" });
        } finally {
            setSending(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("currentUser");
        navigate("/login");
    };

    const backToForm = () => setEmailSent(false); 
    return (
        <div className="min-vh-100 bg-light">
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
                <div className="container-fluid d-flex justify-content-between">
                    <span className="navbar-brand">
                        👋 Hello {user?.username || "Admin"}
                    </span>
                    <div>
                        <button className="btn btn-outline-light me-2" onClick={() => navigate(-1)}>
                            ← Back
                        </button>
                        <button className="btn btn-danger" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            <div className="container py-5">
                {emailSent ? (
                    <div className="card shadow-lg border-0 rounded-4 text-center p-5">
                        <h2 className="text-success mb-4">✅ Email Sent Successfully!</h2>
                        <p>Your message has been delivered.</p>
                        <button className="btn btn-primary mt-3" onClick={backToForm}>
                            Compose Another Email
                        </button>
                    </div>
                ) : (
                    <div className="card shadow-lg border-0 rounded-4">
                        <div className="card-body p-4">
                            <h2 className="text-center mb-4 text-primary">Compose New Email</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">From</label>
                                    <input
                                        type="email"
                                        className={`form-control ${errors.from ? "is-invalid" : ""}`}
                                        value={fromRaw}
                                        onChange={(e) => setFromRaw(e.target.value)}
                                        placeholder="Enter sender email"
                                    />
                                    {errors.from && <div className="invalid-feedback">{errors.from}</div>}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">To</label>
                                    <textarea
                                        className={`form-control ${errors.to ? "is-invalid" : ""}`}
                                        value={toRaw}
                                        onChange={(e) => setToRaw(e.target.value)}
                                        placeholder="Recipient email(s)"
                                    />
                                    {errors.to && <div className="invalid-feedback">{errors.to}</div>}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">CC</label>
                                    <textarea
                                        className="form-control"
                                        value={ccRaw}
                                        onChange={(e) => setCcRaw(e.target.value)}
                                        placeholder="CC email(s) - optional"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">BCC</label>
                                    <textarea
                                        className="form-control"
                                        value={bccRaw}
                                        onChange={(e) => setBccRaw(e.target.value)}
                                        placeholder="BCC email(s) - optional"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Subject</label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.subject ? "is-invalid" : ""}`}
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        placeholder="Enter subject"
                                    />
                                    {errors.subject && <div className="invalid-feedback">{errors.subject}</div>}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Message</label>
                                    <EditorProvider>
                                        <Editor value={html} onChange={(e) => setHtml(e.target.value)}>
                                            <Toolbar>
                                                <BtnBold />
                                                <BtnItalic />
                                                <BtnUnderline />
                                                <BtnStrikeThrough />
                                                <Separator />
                                                <BtnNumberedList />
                                                <BtnBulletList />
                                                <BtnLink />
                                                <Separator />
                                                <BtnUndo />
                                                <BtnRedo />
                                            </Toolbar>
                                        </Editor>
                                    </EditorProvider>
                                    {errors.html && <div className="text-danger">{errors.html}</div>}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Attachments</label>
                                    <input type="file" multiple className="form-control" onChange={onFilesChange} />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Password</label>
                                    <input
                                        type="password"
                                        className={`form-control ${errors.password ? "is-invalid" : ""}`}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter password"
                                    />
                                    {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                                </div>

                                {status && (
                                    <div
                                        className={`alert mt-2 alert-${status?.type === "success"
                                            ? "success"
                                            : status?.type === "error"
                                                ? "danger"
                                                : "info"
                                            }`}
                                    >
                                        {status.message}
                                    </div>
                                )}

                                <button type="submit" className="btn btn-primary w-100" disabled={sending}>
                                    {sending ? "Sending..." : "Send Email"}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
