import { CheckCircle2 } from "lucide-react";
import Image from "next/image";

export function LiveEditorFeature() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-800 mb-6">
            WYSIWYG Editor
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Design Invoices in Real-Time.
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Stop guessing what your invoice will look like. With our
            split-screen editor, you type on the left and see the result on the
            right instantly.
          </p>

          <ul className="space-y-4">
            {[
              "Real-time preview as you type",
              "Choose from professional templates",
              "Auto-calculated totals and taxes",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative bg-gray-100 rounded-2xl p-2 border border-gray-200 shadow-xl overflow-hidden">
          <div className="flex items-center gap-1.5 p-2 bg-white rounded-t-xl border-b border-gray-100">
            <div className="w-2.5 h-2.5 bg-red-400 rounded-full"></div>
            <div className="w-2.5 h-2.5 bg-yellow-400 rounded-full"></div>
            <div className="w-2.5 h-2.5 bg-green-400 rounded-full"></div>
          </div>
          <Image
            src="/images/invoice-editor.png"
            alt="Invoiss Live Invoice Editor"
            width={1200}
            height={750}
            className="w-full h-auto rounded-b-xl"
            priority
          />
        </div>
      </div>
    </section>
  );
}
