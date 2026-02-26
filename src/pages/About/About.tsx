import { Phone, Mail, Clock, MapPin } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            About Card Dispute Portal
          </h1>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Our Purpose
            </h2>
            <p className="text-gray-600 leading-relaxed">
              The Card Dispute Portal is designed to provide Capitec Bank
              clients with a secure, convenient way to view their transactions
              and submit disputes for unauthorized or incorrect charges. Our
              platform ensures your financial concerns are addressed promptly
              and efficiently.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-blue-600" />
                Working Hours
              </h2>
              <div className="space-y-2 text-gray-600">
                <p>
                  <strong>Monday - Friday:</strong> 8:00 AM - 5:00 PM
                </p>
                <p>
                  <strong>Saturday:</strong> 8:00 AM - 1:00 PM
                </p>
                <p>
                  <strong>Sunday:</strong> Closed
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  *Online portal available 24/7
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Contact Details
              </h2>
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <Phone className="w-5 h-5 mr-3 text-blue-600" />
                  <span>0860 10 20 43</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Mail className="w-5 h-5 mr-3 text-blue-600" />
                  <span>disputes@capitecbank.co.za</span>
                </div>
                <div className="flex items-start text-gray-600">
                  <MapPin className="w-5 h-5 mr-3 text-blue-600 mt-0.5" />
                  <div>
                    <p>Capitec Bank Head Office</p>
                    <p>1 Quantum Street, Techno Park</p>
                    <p>Stellenbosch, 7600</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Need Help?</h3>
            <p className="text-blue-800 text-sm">
              If you need assistance with your dispute or have questions about
              our services, please don't hesitate to contact us during our
              working hours or submit your query through the portal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
