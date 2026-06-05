import {
  createContext,
  useContext,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

type TabsContextValue = {
  value: string;
  onValueChange: (value: string) => void;
};

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs components must be used within <Tabs>.");
  }
  return context;
}

type TabsProps = {
  value: string;
  onValueChange: (value: string) => void;
  children: ReactNode;
  className?: string;
};

export function Tabs({ value, onValueChange, children, className }: TabsProps) {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div role="tablist" className={className} {...props}>
      {children}
    </div>
  );
}

type TabsTriggerProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  value: string;
};

export function TabsTrigger({
  value,
  className,
  children,
  ...props
}: TabsTriggerProps) {
  const { value: activeValue, onValueChange } = useTabsContext();
  const isActive = activeValue === value;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      data-state={isActive ? "active" : "inactive"}
      tabIndex={isActive ? 0 : -1}
      className={className}
      onClick={() => onValueChange(value)}
      {...props}
    >
      {children}
    </button>
  );
}

type TabsContentProps = HTMLAttributes<HTMLDivElement> & {
  value: string;
};

export function TabsContent({
  value,
  className,
  children,
  ...props
}: TabsContentProps) {
  const { value: activeValue } = useTabsContext();
  if (activeValue !== value) return null;

  return (
    <div role="tabpanel" className={cn(className)} {...props}>
      {children}
    </div>
  );
}
