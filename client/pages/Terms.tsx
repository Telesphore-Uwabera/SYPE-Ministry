import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function Terms() {
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
              Terms and Conditions
            </h1>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Please read these terms carefully before using our website and services.
            </p>
            <p className="text-sm text-foreground/60 mt-2">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </motion.div>

          {/* Terms Content */}
          <motion.div
            className="max-w-4xl mx-auto space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>1. Acceptance of Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-foreground/80">
                <p>
                  By accessing and using the SYPE Ministry website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>2. Use License</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-foreground/80">
                <p>
                  Permission is granted to temporarily download one copy of the materials on SYPE Ministry's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Modify or copy the materials</li>
                  <li>Use the materials for any commercial purpose or for any public display</li>
                  <li>Attempt to decompile or reverse engineer any software contained on the website</li>
                  <li>Remove any copyright or other proprietary notations from the materials</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>3. Membership Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-foreground/80">
                <p>
                  Membership in SYPE Ministry is subject to the following conditions:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Members must be active Seventh-day Adventist members from Adventist Student Associations (ASSAs)</li>
                  <li>Members must demonstrate commitment to SYPE's mission and purpose</li>
                  <li>Membership is invitation-based and subject to approval</li>
                  <li>Members are expected to participate actively in ministry activities</li>
                  <li>SYPE Ministry reserves the right to revoke membership for violations of these terms</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>4. Content and Intellectual Property</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-foreground/80">
                <p>
                  All content on this website, including but not limited to text, graphics, logos, images, audio clips, digital downloads, and software, is the property of SYPE Ministry or its content suppliers and is protected by international copyright laws.
                </p>
                <p>
                  You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any of the material on our website without prior written consent from SYPE Ministry.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>5. User Conduct</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-foreground/80">
                <p>Users agree not to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Use the website in any way that violates any applicable law or regulation</li>
                  <li>Transmit any material that is defamatory, offensive, or otherwise objectionable</li>
                  <li>Interfere with or disrupt the website or servers connected to the website</li>
                  <li>Attempt to gain unauthorized access to any portion of the website</li>
                  <li>Use automated systems to access the website without permission</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>6. Donations and Contributions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-foreground/80">
                <p>
                  All donations and contributions to SYPE Ministry are voluntary and non-refundable. Donations are used to support evangelism projects and ministry activities as determined by the ministry leadership.
                </p>
                <p>
                  SYPE Ministry is committed to transparency and will use donated funds in accordance with our stated mission and purpose.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>7. Disclaimer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-foreground/80">
                <p>
                  The materials on SYPE Ministry's website are provided on an 'as is' basis. SYPE Ministry makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>8. Limitations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-foreground/80">
                <p>
                  In no event shall SYPE Ministry or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on SYPE Ministry's website, even if SYPE Ministry or a SYPE Ministry authorized representative has been notified orally or in writing of the possibility of such damage.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>9. Revisions and Errata</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-foreground/80">
                <p>
                  The materials appearing on SYPE Ministry's website could include technical, typographical, or photographic errors. SYPE Ministry does not warrant that any of the materials on its website are accurate, complete, or current. SYPE Ministry may make changes to the materials contained on its website at any time without notice.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>10. Links to Third-Party Sites</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-foreground/80">
                <p>
                  SYPE Ministry has not reviewed all of the sites linked to our website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by SYPE Ministry of the site. Use of any such linked website is at the user's own risk.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>11. Modifications to Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-foreground/80">
                <p>
                  SYPE Ministry may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>12. Governing Law</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-foreground/80">
                <p>
                  These terms and conditions are governed by and construed in accordance with the laws of Rwanda and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>13. Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-foreground/80">
                <p>
                  If you have any questions about these Terms and Conditions, please contact us at:
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

