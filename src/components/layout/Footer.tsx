import { Container } from '@/components/ui/Container';

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <Container>
        <div className="flex flex-col sm:flex-row items-center justify-between py-6 gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gradient">Voidspace</span>
            <span className="text-xs text-text-muted">
              &copy; {new Date().getFullYear()}
            </span>
          </div>
          <p className="text-xs text-text-muted">
            Built for the NEAR ecosystem
          </p>
        </div>
      </Container>
    </footer>
  );
}
