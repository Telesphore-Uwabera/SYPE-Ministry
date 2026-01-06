import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function Cookies() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-muted/50 to-background py-12 md:py-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-heading font-bold text-4xl md:text-5xl text-primary mb-4">
              Cookies Policy
            </h1>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Learn about how we use cookies and similar technologies on our website.
            </p>
            <p className="text-sm text-foreground/60 mt-2">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </motion.div>

          {/* Cookies Content */}
          <motion.div
            className="max-w-4xl mx-auto space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>1. What Are Cookies?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-foreground/80">
                <p>
                  Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners.
                </p>
                <p>
                  Cookies allow a website to recognize your device and store some information about your preferences or past actions.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>2. How We Use Cookies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-foreground/80">
                <p>SYPE Ministry uses cookies for the following purposes:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Essential Cookies:</strong> Required for the website to function properly</li>
                  <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website</li>
                  <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                  <li><strong>Functional Cookies:</strong> Enable enhanced functionality and personalization</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>3. Types of Cookies We Use</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-foreground/80">
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold">Session Cookies</p>
                    <p>
                      These are temporary cookies that are deleted when you close your browser. They help maintain your session while navigating our website.
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold">Persistent Cookies</p>
                    <p>
                      These cookies remain on your device for a set period or until you delete them. They help us remember your preferences and improve your experience on future visits.
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold">Third-Party Cookies</p>
                    <p>
                      Some cookies are placed by third-party services that appear on our pages, such as YouTube embeds or analytics services. We do not control these cookies.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>4. Specific Cookies We Use</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-foreground/80">
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold">Website Functionality</p>
                    <p>
                      We use cookies to ensure our website functions correctly and to remember your preferences, such as language settings.
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold">Analytics</p>
                    <p>
                      We may use analytics cookies to understand how visitors use our website, which pages are most popular, and how users navigate through our site. This helps us improve our website's performance and user experience.
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold">Social Media</p>
                    <p>
                      If you interact with social media features on our website (such as YouTube embeds), these services may set their own cookies. We do not control these cookies.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>5. Managing Cookies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-foreground/80">
                <p>
                  You have the right to accept or reject cookies. Most web browsers automatically accept cookies, but you can usually modify your browser settings to decline cookies if you prefer.
                </p>
                <p className="font-semibold">How to manage cookies in different browsers:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</li>
                  <li><strong>Firefox:</strong> Options → Privacy & Security → Cookies and Site Data</li>
                  <li><strong>Safari:</strong> Preferences → Privacy → Cookies and website data</li>
                  <li><strong>Edge:</strong> Settings → Cookies and site permissions → Cookies and site data</li>
                </ul>
                <p className="mt-4">
                  Please note that disabling cookies may affect the functionality of our website and your user experience.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>6. Third-Party Cookies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-foreground/80">
                <p>
                  Some content on our website is provided by third parties, such as YouTube videos. These third parties may set their own cookies when you interact with their content. We do not control these cookies, and we recommend reviewing the privacy policies of these third-party services.
                </p>
                <p>
                  Third-party services we may use include:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>YouTube (for video content)</li>
                  <li>Analytics services (to understand website usage)</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>7. Cookie Consent</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-foreground/80">
                <p>
                  By continuing to use our website, you consent to our use of cookies as described in this policy. If you do not agree to our use of cookies, you should set your browser settings accordingly or refrain from using our website.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>8. Updates to This Policy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-foreground/80">
                <p>
                  We may update this Cookies Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the updated policy on this page.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>9. Contact Us</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-foreground/80">
                <p>
                  If you have any questions about our use of cookies, please contact us:
                </p>
                <p className="font-semibold">
                  Email: sypeministry@gmail.com<br />
                  Phone: +250 780 430 990 / +250 785 073 847<br />
                  Location: Kigali, Rwanda
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}

