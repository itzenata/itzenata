'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState, useCallback, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';

export interface SearchInputProps {
  placeholder?: string;
  queryKey?: string; // The query key for the search parameter (default: 'q')
}

export function SearchInput({
  placeholder = 'Search...',
  queryKey = 'q'
}: SearchInputProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [searchValue, setSearchValue] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = useCallback(
    (value: string) => {
      setIsPending(true);
      const params = new URLSearchParams(window.location.search);
      if (value) {
        params.set(queryKey, value);
      } else {
        params.delete(queryKey);
      }
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      setTimeout(() => {
        setIsPending(false);
      }, 300);
    },
    [pathname, queryKey, router]
  );

  const handleClose = () => {
    setIsVisible(false);
    setSearchValue('');
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialValue = params.get(queryKey) || '';
    setSearchValue(initialValue);
  }, [queryKey]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' || (e.key === 'k' && (e.metaKey || e.ctrlKey))) {
        e.preventDefault();
        setIsVisible(true);
        inputRef.current?.focus();
      } else if (e.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="mt-23 fixed inset-x-0 top-4 z-50 flex justify-center">
      <div
        className={`relative transition-all duration-300 ease-out ${
          isVisible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="relative overflow-hidden rounded-2xl bg-background/95 shadow-2xl ring-1 ring-black/5 backdrop-blur-lg">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5" />
          <form
            onSubmit={(e) => e.preventDefault()}
            className="relative flex items-center p-1"
          >
            <div className="flex h-14 w-[600px] items-center rounded-xl bg-muted/40 px-4">
              <Search className="h-5 w-5 text-muted-foreground/70" />
              <Input
                ref={inputRef}
                name={queryKey}
                type="search"
                placeholder={placeholder}
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                  handleSearch(e.target.value);
                }}
                className="h-full border-0 bg-transparent px-3 text-lg shadow-none focus-visible:ring-0"
                onBlur={() => {
                  if (!searchValue) {
                    setIsVisible(false);
                  }
                }}
                autoFocus={isVisible}
              />
              <div className="flex items-center gap-3">
                <>
                  <kbd className="hidden rounded-lg bg-background/80 px-2 py-1 text-xs font-medium text-muted-foreground shadow-sm md:inline-block">
                    ESC
                  </kbd>
                  <button
                    onClick={handleClose}
                    className="rounded-lg p-1 hover:bg-background/80"
                  >
                    <X className="h-5 w-5 text-muted-foreground/70" />
                  </button>
                </>
              </div>
            </div>
          </form>
          <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        </div>
      </div>
      {isVisible && (
        <div className="fixed inset-0 -z-10" onClick={handleClose} />
      )}
    </div>
  );
}

export default SearchInput;
