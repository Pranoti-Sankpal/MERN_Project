import Layout from '../components/layout/Layout'

const About = () => {
    return (
        <Layout>
            <div className="max-w-5xl mx-auto p-12">
                <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
                    About Us
                </h1>

                <div className="bg-white shadow-md rounded-lg p-8 space-y-8">

                    {/* Overview */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-700 mb-3">
                            Who We Are
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                            Sunbeam Institute of Information Technology and C-DAC Pune are
                            among the most reputed technical training institutes in Pune.
                            They are widely preferred by engineering students and graduates
                            aiming for strong careers in software development, advanced
                            computing, and IT product companies.
                        </p>
                        <p className="text-gray-600 leading-relaxed mt-3">
                            Sunbeam primarily focuses on preparatory, certification, and
                            short-term skill-based courses, often acting as a feeder institute
                            for C-DAC admissions. C-DAC, being a government-backed organization,
                            offers advanced postgraduate diplomas with high industry
                            recognition and placement value.
                        </p>
                    </section>

                    {/* Locations */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-700 mb-3">
                            Locations
                        </h2>
                        <ul className="list-disc list-inside text-gray-600 space-y-2">
                            <li>
                                <strong>Sunbeam Pune:</strong> Hinjawadi (near Phase 2) and
                                Gultekdi, Market Yard Road
                            </li>
                            <li>
                                <strong>C-DAC Pune:</strong> Pune University Campus, Ganesh
                                Khind, Pune – 411007
                            </li>
                        </ul>
                    </section>

                    {/* Courses */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-700 mb-3">
                            Key Courses Offered
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                            Sunbeam offers Pre-CAT programs (preparation for C-DAC entrance),
                            certificate courses in C++, Java, Python, Data Structures, and
                            full-time PG Diplomas such as Mobile Computing.
                        </p>
                        <p className="text-gray-600 leading-relaxed mt-3">
                            C-DAC is best known for its PG Diploma programs like PG-DAC
                            (Post Graduate Diploma in Advanced Computing), which focus on
                            industry-ready skills in core IT, system programming, and
                            enterprise development.
                        </p>
                    </section>

                    {/* Fees */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-700 mb-3">
                            Fees Structure (Approximate)
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="w-full border border-gray-200 text-gray-600">
                                <thead className="bg-gray-100 text-gray-700">
                                    <tr>
                                        <th className="border px-4 py-2 text-left">Institute</th>
                                        <th className="border px-4 py-2 text-left">Course Type</th>
                                        <th className="border px-4 py-2 text-left">Fees (₹)</th>
                                        <th className="border px-4 py-2 text-left">Notes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="border px-4 py-2">Sunbeam</td>
                                        <td className="border px-4 py-2">PG Diploma</td>
                                        <td className="border px-4 py-2">~80,000</td>
                                        <td className="border px-4 py-2">One-time / institute fees</td>
                                    </tr>
                                    <tr>
                                        <td className="border px-4 py-2">Sunbeam</td>
                                        <td className="border px-4 py-2">Certificate Courses</td>
                                        <td className="border px-4 py-2">4,500 – 9,800</td>
                                        <td className="border px-4 py-2">Short-term programs</td>
                                    </tr>
                                    <tr>
                                        <td className="border px-4 py-2">C-DAC</td>
                                        <td className="border px-4 py-2">PG Diploma</td>
                                        <td className="border px-4 py-2">~80,000</td>
                                        <td className="border px-4 py-2">Paid in installments</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* Admissions */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-700 mb-3">
                            Admissions Process
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                            Sunbeam admissions are based on merit or entrance criteria and
                            often accept students appearing for or qualified in the C-CAT
                            exam. C-DAC admissions strictly require clearing the C-CAT exam,
                            followed by centralized counseling.
                        </p>
                        <p className="text-gray-600 leading-relaxed mt-3">
                            Sunbeam’s Pre-CAT programs are specifically designed to help
                            students crack the C-DAC entrance exam with confidence.
                        </p>
                    </section>

                    {/* Placements */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-700 mb-3">
                            Placements & Career Relevance
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                            Both institutes strongly focus on placements in software
                            development roles. Sunbeam acts as a strong foundation builder
                            for Java, MERN, and ML careers, while C-DAC is known for excellent
                            placement records in advanced computing and product-based
                            companies.
                        </p>
                        <p className="text-gray-600 leading-relaxed mt-3">
                            For students interested in MERN stack, Java, backend systems,
                            and competitive IT roles, starting with Sunbeam and progressing
                            to C-DAC PG-DAC is a proven and effective pathway.
                        </p>
                    </section>

                </div>
            </div>
        </Layout>
    )
}

export default About
