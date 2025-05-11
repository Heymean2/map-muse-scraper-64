
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import BaseLayout from "@/components/layout/BaseLayout";
import { Container } from "@/components/ui/container";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface Page {
  id: string;
  title: string;
  content: string;
  slug: string;
  updated_at: string;
}

export default function PageView() {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPage() {
      try {
        const { data, error } = await supabase
          .from('pages')
          .select('*')
          .eq('slug', slug)
          .eq('published', true)
          .maybeSingle();

        if (error) {
          throw error;
        }

        if (data) {
          setPage(data);
        } else {
          setError("Page not found");
        }
      } catch (error) {
        console.error("Error fetching page:", error);
        setError("Failed to load page");
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchPage();
    }
  }, [slug]);

  if (loading) {
    return (
      <BaseLayout>
        <Container className="py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </Container>
      </BaseLayout>
    );
  }

  if (error || !page) {
    return (
      <BaseLayout>
        <Container className="py-8">
          <Card>
            <CardContent className="pt-6">
              <h1 className="text-2xl font-bold text-center">Page Not Found</h1>
              <p className="text-center text-muted-foreground mt-2">The page you're looking for doesn't exist or is not published.</p>
              <div className="flex justify-center mt-6">
                <Button asChild>
                  <Link to="/">Back to Home</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </Container>
      </BaseLayout>
    );
  }

  const formattedDate = new Date(page.updated_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <BaseLayout>
      <Container className="py-8">
        <div className="mb-6">
          <Button variant="outline" asChild size="sm">
            <Link to="/dashboard" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <h1 className="text-3xl font-bold">{page.title}</h1>
            <p className="text-sm text-muted-foreground mt-2">Last updated: {formattedDate}</p>
            <Separator className="my-6" />
            <div 
              className="prose prose-slate max-w-none"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          </CardContent>
        </Card>
      </Container>
    </BaseLayout>
  );
}
