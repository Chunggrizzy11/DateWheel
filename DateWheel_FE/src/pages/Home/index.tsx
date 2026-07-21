import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../../hooks/useProfile';
import { ROUTES } from '../../constants/routes';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import ProfileAvatar from '../../components/common/ProfileAvatar';
import { gsap, useGSAP } from '../../lib/gsap';

import logoImg from '../../assets/images/Logo.png';

export default function Home() {
  const navigate = useNavigate();
  const { profiles, currentProfile, loading, setCurrentProfile } = useProfile();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentProfile) {
      navigate(ROUTES.DASHBOARD);
    }
  }, [currentProfile, navigate]);

  // Entrance animation using useGSAP with scope ref (gsap-react skill)
  useGSAP(
    () => {
      if (profiles.length === 0) return; // Wait until profiles are loaded
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const tl = gsap.timeline();

      tl.from('[data-gsap="hero-title"]', {
        autoAlpha: 0,
        y: reduceMotion ? 0 : -30,
        duration: reduceMotion ? 0 : 0.6,
        ease: 'power3.out',
      })
        .from(
          '[data-gsap="hero-sub"]',
          {
            autoAlpha: 0,
            y: reduceMotion ? 0 : 20,
            duration: reduceMotion ? 0 : 0.5,
            ease: 'power2.out',
          },
          '-=0.3'
        )
        .from(
          '[data-gsap="profile-card"]',
          {
            autoAlpha: 0,
            y: reduceMotion ? 0 : 40,
            scale: reduceMotion ? 1 : 0.95,
            stagger: { each: 0.12 },
            duration: reduceMotion ? 0 : 0.5,
            ease: 'back.out(1.5)',
            clearProps: 'all',
          },
          '-=0.2'
        );
    },
    { scope: containerRef, dependencies: [profiles] }
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loading size="lg" text="Loading profiles..." />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl text-center space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-4">
            <div data-gsap="hero-title">
              <img src={logoImg} alt="Decision Wheel Logo" className="w-64 md:w-[450px] h-auto object-contain drop-shadow-md" />
            </div>
          </div>

          <p data-gsap="hero-sub" className="text-xl text-body">
            Choose your profile to continue
          </p>
        </div>

        {/* Profile Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
          {profiles.map((profile) => (
            <div
              key={profile._id}
              data-gsap="profile-card"
              className="cursor-pointer"
              onClick={() => {
                setCurrentProfile(profile);
                navigate(ROUTES.DASHBOARD);
              }}
            >
              <Card
                hover
                glass
                className="flex flex-col items-center p-10 group"
              >
                <ProfileAvatar name={profile.name} size="xl" className="mb-6 group-hover:scale-110 transition-transform duration-300" />
                <h2 className="text-2xl font-bold">{profile.name}</h2>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
