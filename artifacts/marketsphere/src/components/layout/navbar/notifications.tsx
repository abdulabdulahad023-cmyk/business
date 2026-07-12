import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MOCK_NOTIFICATIONS } from '@/lib/mock-data';
import { ScrollArea } from '@/components/ui/scroll-area';

export function Notifications() {
  const unreadCount = MOCK_NOTIFICATIONS.filter(n => n.isUnread).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full relative text-foreground/80 hover:text-foreground hidden sm:inline-flex">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-accent border border-background"></span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 mt-2 rounded-xl p-0">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <DropdownMenuLabel className="font-display font-semibold p-0">Notifications</DropdownMenuLabel>
          <span className="text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Mark all as read</span>
        </div>
        
        <ScrollArea className="max-h-[300px]">
          {MOCK_NOTIFICATIONS.length > 0 ? (
            <div className="flex flex-col">
              {MOCK_NOTIFICATIONS.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`px-4 py-3 hover:bg-muted/50 cursor-pointer transition-colors flex gap-3 ${notification.isUnread ? 'bg-muted/20' : ''}`}
                >
                  <div className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${notification.isUnread ? 'bg-accent' : 'bg-transparent'}`} />
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold">{notification.title}</span>
                    <span className="text-xs text-muted-foreground leading-snug">{notification.description}</span>
                    <span className="text-[10px] text-muted-foreground/70 mt-1">{notification.time}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No new notifications
            </div>
          )}
        </ScrollArea>
        
        {MOCK_NOTIFICATIONS.length > 0 && (
          <div className="p-2 border-t border-border">
            <Button variant="ghost" className="w-full text-xs font-semibold">View All</Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
