import { useEffect } from 'react';
import { useProfileStore } from '../../store/profile.store';
import { useSetting } from '../../hooks/useSetting';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import { Moon, Volume2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function Settings() {
  const { currentProfile } = useProfileStore();
  const owner = currentProfile?._id;
  const { settings, loading, fetchSettings, updateSettings } = useSetting(owner);

  useEffect(() => { if (owner) fetchSettings(); }, [owner, fetchSettings]);

  if (loading || !settings) return <div className="page-container flex justify-center py-20"><Loading /></div>;


  const ToggleRow = ({ icon: Icon, title, desc, checked, onChange }: any) => (
    <div className="flex items-center justify-between py-4 border-b border-border last:border-0">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-primary"><Icon size={20} /></div>
        <div>
          <h4 className="font-semibold">{title}</h4>
          <p className="text-sm text-muted-foreground">{desc}</p>
        </div>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" className="sr-only peer" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
      </label>
    </div>
  );

  return (
    <div className="page-container animate-fade-in max-w-3xl">
      <h1 className="section-title">Settings</h1>
      
      <Card className="mb-6">
        <h3 className="font-bold text-lg mb-4">Preferences</h3>
        <ToggleRow icon={Moon} title="Dark Mode" desc="Switch between light and dark themes." checked={settings.darkMode} onChange={(v: boolean) => updateSettings({ darkMode: v })} />
        <ToggleRow icon={Volume2} title="Sound Effects" desc="Play sounds on wheel spin and wins." checked={settings.sound} onChange={(v: boolean) => updateSettings({ sound: v })} />
        <ToggleRow icon={Sparkles} title="Animations" desc="Enable confetti and extra visual effects." checked={settings.animation} onChange={(v: boolean) => updateSettings({ animation: v })} />
      </Card>


    </div>
  );
}
