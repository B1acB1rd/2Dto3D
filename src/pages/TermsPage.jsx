import { Link } from 'react-router-dom'

function TermsPage() {
    return (
        <div className="legal-page">
            <div className="legal-container">
                <Link to="/" className="back-link">← Back to App</Link>

                <h1>Terms of Service</h1>
                <p className="last-updated">Last Updated: December 30, 2024</p>

                <section>
                    <h2>1. Acceptance of Terms</h2>
                    <p>
                        By accessing and using the 2D to 3D Map Converter ("Service"), you agree to be bound by these
                        Terms of Service. If you do not agree to these terms, please do not use our Service.
                    </p>
                </section>

                <section>
                    <h2>2. Description of Service</h2>
                    <p>
                        The 2D to 3D Map Converter is an AI-powered tool that converts 2D map images into 3D terrain models.
                        The Service includes automatic depth estimation, AI-assisted editing, and manual editing features.
                    </p>
                </section>

                <section>
                    <h2>3. User Responsibilities</h2>
                    <ul>
                        <li>You must only upload images that you own or have the right to use</li>
                        <li>You agree not to upload illegal, offensive, or copyrighted content without permission</li>
                        <li>You are responsible for how you use the generated 3D models</li>
                        <li>You agree not to abuse or overload the Service</li>
                    </ul>
                </section>

                <section>
                    <h2>4. Intellectual Property</h2>
                    <p>
                        You retain ownership of the images you upload. The 3D models generated from your images
                        belong to you. The Service's underlying technology, design, and code remain the property
                        of B1ACB1RD Corp.
                    </p>
                </section>

                <section>
                    <h2>5. AI Features</h2>
                    <p>
                        The AI-assisted features use third-party AI models (including Google's Gemini).
                        AI-generated edits may not always be accurate. You are responsible for reviewing
                        and approving any AI-made modifications to your 3D models.
                    </p>
                </section>

                <section>
                    <h2>6. Limitation of Liability</h2>
                    <p>
                        The Service is provided "as is" without warranties of any kind. B1ACB1RD Corp is not
                        liable for any damages arising from the use of this Service, including but not limited to
                        data loss, inaccurate 3D models, or service interruptions.
                    </p>
                </section>

                <section>
                    <h2>7. Modifications to Terms</h2>
                    <p>
                        We reserve the right to modify these terms at any time. Continued use of the Service
                        after changes constitutes acceptance of the new terms.
                    </p>
                </section>

                <section>
                    <h2>8. Contact</h2>
                    <p>
                        For questions about these Terms, please visit{' '}
                        <a href="https://b1acb1rd-corp.vercel.app/" target="_blank" rel="noopener noreferrer">
                            B1ACB1RD Corp
                        </a>.
                    </p>
                </section>
            </div>
        </div>
    )
}

export default TermsPage
