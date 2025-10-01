import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Heart, Users, BookOpen, GraduationCap, Target } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-8 max-w-5xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl sm:text-4xl font-bold">About BYU-Pathway Connect</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Empowering students worldwide through accessible education, career development, and spiritual growth.
            </p>
          </div>

          {/* Mission Statement */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                BYU-Pathway Connect is dedicated to providing accessible, high-quality education to students around the world. 
                We believe that education is the key to unlocking potential, building careers, and strengthening communities.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Through our innovative online platform, we connect students with resources, mentorship, and opportunities 
                that help them achieve their academic and professional goals while maintaining a foundation of faith and values.
              </p>
            </CardContent>
          </Card>

          {/* What We Offer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6 text-center space-y-4">
                <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Academic Resources</h3>
                <p className="text-sm text-muted-foreground">
                  Access to digital books, course materials, and study guides to support your learning journey.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center space-y-4">
                <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Career Development</h3>
                <p className="text-sm text-muted-foreground">
                  Professional development tools, job opportunities, and career planning resources.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center space-y-4">
                <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Community Support</h3>
                <p className="text-sm text-muted-foreground">
                  Connect with fellow students through study groups and community forums.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Values */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Our Core Values
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { title: "Faith", description: "Building spiritual strength alongside academic achievement" },
                  { title: "Excellence", description: "Pursuing the highest quality in education and service" },
                  { title: "Accessibility", description: "Making education available to all who seek it" },
                  { title: "Community", description: "Supporting each other in our educational journeys" },
                  { title: "Innovation", description: "Embracing new technologies and teaching methods" },
                  { title: "Integrity", description: "Upholding honesty and ethical standards in all we do" }
                ].map((value, index) => (
                  <div key={index} className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-semibold mb-2">{value.title}</h4>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Contact CTA */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <h3 className="text-xl font-semibold">Get in Touch</h3>
                <p className="text-muted-foreground">
                  Have questions or need support? We're here to help you succeed.
                </p>
                <Button asChild size="lg">
                  <a href="https://help.byupathway.edu/" target="_blank" rel="noopener noreferrer">
                    <Mail className="h-4 w-4 mr-2" />
                    Contact Support
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
