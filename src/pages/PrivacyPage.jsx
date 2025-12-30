import { Link } from 'react-router-dom'

function PrivacyPage() {
    return (
        <div className="legal-page">
            <div className="legal-container">
                <Link to="/" className="back-link">← Back to App</Link>

                <h1>Privacy Policy</h1>
                <p className="last-updated">Last Updated: December 30, 2024</p>

                <section>
                    <h2>1. Introduction</h2>
                    <p>
                        B1ACB1RD Corp ("we", "our", or "us") operates the 2D to 3D Map Converter.
                        This Privacy Policy explains how we collect, use, and protect your information.
                    </p>
                </section>

                <section>
                    <h2>2. Information We Collect</h2>
                    <h3>Images You Upload</h3>
                    <ul>
                        <li>We process the images you upload to generate 3D models</li>
                        <li>Images are temporarily stored on our servers during processing</li>
                        <li>Images may be deleted after a period of inactivity</li>
                    </ul>

                    <h3>Usage Data</h3>
                    <ul>
                        <li>Conversion settings (height scale, detail level, mode)</li>
                        <li>Basic analytics (page views, feature usage)</li>
                        <li>Error logs for debugging purposes</li>
                    </ul>
                </section>

                <section>
                    <h2>3. How We Use Your Information</h2>
                    <ul>
                        <li>To provide the 2D to 3D conversion service</li>
                        <li>To improve our AI algorithms and service quality</li>
                        <li>To diagnose technical issues</li>
                        <li>To communicate about service updates</li>
                    </ul>
                </section>

                <section>
                    <h2>4. Third-Party Services</h2>
                    <p>We use the following third-party services:</p>
                    <ul>
                        <li><strong>Google Gemini AI</strong> - For AI-assisted terrain analysis (subject to Google's Privacy Policy)</li>
                        <li><strong>Hugging Face</strong> - Backend hosting</li>
                        <li><strong>Vercel</strong> - Frontend hosting</li>
                    </ul>
                    <p>These services may collect their own data as described in their respective privacy policies.</p>
                </section>

                <section>
                    <h2>5. Data Retention</h2>
                    <ul>
                        <li>Uploaded images: Temporarily stored, deleted after processing or inactivity</li>
                        <li>Generated 3D models: Available for download, deleted after inactivity</li>
                        <li>Usage analytics: Retained for service improvement</li>
                    </ul>
                </section>

                <section>
                    <h2>6. Data Security</h2>
                    <p>
                        We implement reasonable security measures to protect your data. However, no method
                        of transmission over the Internet is 100% secure. We cannot guarantee absolute security.
                    </p>
                </section>

                <section>
                    <h2>7. Your Rights</h2>
                    <ul>
                        <li>You can delete your uploaded images and generated models at any time</li>
                        <li>You can request information about data we hold about you</li>
                        <li>You can request deletion of your data by contacting us</li>
                    </ul>
                </section>

                <section>
                    <h2>8. Cookies</h2>
                    <p>
                        We may use cookies and similar technologies for session management and analytics.
                        You can control cookie settings through your browser.
                    </p>
                </section>

                <section>
                    <h2>9. Children's Privacy</h2>
                    <p>
                        This Service is not intended for children under 13. We do not knowingly collect
                        personal information from children under 13.
                    </p>
                </section>

                <section>
                    <h2>10. Changes to This Policy</h2>
                    <p>
                        We may update this Privacy Policy from time to time. We will notify you of significant
                        changes by updating the "Last Updated" date.
                    </p>
                </section>

                <section>
                    <h2>11. Contact Us</h2>
                    <p>
                        For privacy-related questions or requests, please visit{' '}
                        <a href="https://b1acb1rd-corp.vercel.app/" target="_blank" rel="noopener noreferrer">
                            B1ACB1RD Corp
                        </a>.
                    </p>
                </section>
            </div>
        </div>
    )
}

export default PrivacyPage
