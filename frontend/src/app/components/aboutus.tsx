import { useUser } from '../context/UserContext';
import Sidebar from './ui/sidebar';
import { Droplets, Target, Users, CheckCircle } from 'lucide-react';

export default function About() {
  const { user } = useUser();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#003366] to-[#0055aa] flex items-center justify-center p-5">
        <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-[#003366] p-4 rounded-full mb-4">
              <Droplets size={48} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-[#003366] text-center mb-4">
              About Our System
            </h1>
          </div>

          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-2xl font-semibold text-[#003366] mb-3">
                Barangay Poblacion Norte Pipe Damage Monitoring System
              </h2>
              <p className="leading-relaxed">
                Our system is designed to streamline the reporting and management of pipe damage incidents
                in Barangay Poblacion Norte. We provide an efficient platform for residents to report issues
                and for administrators to track and resolve them promptly.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-[#003366] mb-3 flex items-center gap-2">
                <Target size={24} />
                Mission
              </h3>
              <p className="leading-relaxed">
                To ensure the continuous delivery of clean water to our community by maintaining a responsive
                and transparent system for addressing pipe damage and infrastructure issues.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-[#003366] mb-3 flex items-center gap-2">
                <Users size={24} />
                Who We Serve
              </h3>
              <p className="leading-relaxed">
                This system serves the residents of Barangay Poblacion Norte and is managed by the
                Waterwork Office to ensure quick response times and effective resolution of water
                infrastructure issues.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-[#003366] mb-3 flex items-center gap-2">
                <CheckCircle size={24} />
                Key Features
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-[#003366] mt-1">•</span>
                  <span>Easy report submission with photo upload capabilities</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#003366] mt-1">•</span>
                  <span>Real-time status tracking of submitted reports</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#003366] mt-1">•</span>
                  <span>Notification system to keep residents informed</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#003366] mt-1">•</span>
                  <span>Administrative dashboard for efficient issue management</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#003366] mt-1">•</span>
                  <span>Comprehensive history of all reported incidents</span>
                </li>
              </ul>
            </section>

            <section className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-[#003366] mb-3">Contact Information</h3>
              <p className="leading-relaxed">
                <strong>Barangay Waterwork Office</strong><br />
                Poblacion Norte, Philippines<br />
                Email: waterwork@poblacionnorte.gov.ph<br />
                Phone: (123) 456-7890
              </p>
            </section>
          </div>
        </div>
      </div>
    );
  }

  const userType = user.role === 'admin' ? 'admin' : 'resident';

  return (
    <div className="min-h-screen flex">
      <Sidebar userType={userType} />
      <div className="flex-1 w-full md:ml-64 bg-[#f0f8ff] min-h-screen h-screen overflow-y-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex flex-col items-center mb-8">
              <div className="bg-[#003366] p-4 rounded-full mb-4">
                <Droplets size={48} className="text-white" />
              </div>
              <h1 className="text-3xl font-bold text-[#003366] text-center mb-4">
                About Our System
              </h1>
            </div>

            <div className="space-y-6 text-gray-700">
              <section>
                <h2 className="text-2xl font-semibold text-[#003366] mb-3">
                  Barangay Poblacion Norte Pipe Damage Monitoring System
                </h2>
                <p className="leading-relaxed">
                  Our system is designed to streamline the reporting and management of pipe damage incidents
                  in Barangay Poblacion Norte. We provide an efficient platform for residents to report issues
                  and for administrators to track and resolve them promptly.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-[#003366] mb-3 flex items-center gap-2">
                  <Target size={24} />
                  Mission
                </h3>
                <p className="leading-relaxed">
                  To ensure the continuous delivery of clean water to our community by maintaining a responsive
                  and transparent system for addressing pipe damage and infrastructure issues.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-[#003366] mb-3 flex items-center gap-2">
                  <Users size={24} />
                  Who We Serve
                </h3>
                <p className="leading-relaxed">
                  This system serves the residents of Barangay Poblacion Norte and is managed by the
                  Waterwork Office to ensure quick response times and effective resolution of water
                  infrastructure issues.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-[#003366] mb-3 flex items-center gap-2">
                  <CheckCircle size={24} />
                  Key Features
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-[#003366] mt-1">•</span>
                    <span>Easy report submission with photo upload capabilities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#003366] mt-1">•</span>
                    <span>Real-time status tracking of submitted reports</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#003366] mt-1">•</span>
                    <span>Notification system to keep residents informed</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#003366] mt-1">•</span>
                    <span>Administrative dashboard for efficient issue management</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#003366] mt-1">•</span>
                    <span>Comprehensive history of all reported incidents</span>
                  </li>
                </ul>
              </section>

              <section className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-[#003366] mb-3">Contact Information</h3>
                <p className="leading-relaxed">
                  <strong>Barangay Waterwork Office</strong><br />
                  Poblacion Norte, Philippines<br />
                  Email: waterwork@poblacionnorte.gov.ph<br />
                  Phone: (123) 456-7890
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
