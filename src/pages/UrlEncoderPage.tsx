import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import UrlEncoder from "@/components/cyber-tools/UrlEncoder";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const UrlEncoderPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="mb-6">
          <Link to="/cyber-tools">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Cyber Tools
            </Button>
          </Link>
        </div>
        <div className="max-w-2xl mx-auto">
          <UrlEncoder />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UrlEncoderPage;
