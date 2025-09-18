import {
  Building2,
  Users,
  FileText,
  Calculator,
  Shield,
  Clock,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  Star,
  ArrowRight,
} from "lucide-react"
import { Link } from "react-router-dom"
import { useStateContext } from "../contexts/ContextProvider";
import { useEffect, useState } from "react";

export default function SyndicateLandingPage() {


    const {token} = useStateContext();
    const [destination, setDestination] = useState('/auth/login');
    const [labelAuth, setLabelAuth] = useState('Connexion');

    useEffect(()=>{
        if(token){
            setDestination('/dashboard');
            setLabelAuth('Tableau de bord');
        } else {
            setDestination('/auth/login');
            setLabelAuth('Connexion');
        }
    },[token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 transition-all duration-300">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 group">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-2 rounded-lg shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors duration-300">SyndicBox</span>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-600 hover:text-blue-600 transition-all duration-300 relative group">
                Fonctionnalités
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#services" className="text-slate-600 hover:text-blue-600 transition-all duration-300 relative group">
                Services
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#about" className="text-slate-600 hover:text-blue-600 transition-all duration-300 relative group">
                À propos
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#contact" className="text-slate-600 hover:text-blue-600 transition-all duration-300 relative group">
                Contact
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
               <Link to={destination}
               className="text-slate-600 hover:text-blue-600 transition-all duration-300 relative group"
              >
                {labelAuth}
              </Link>
            </nav>

            <div className="flex items-center space-x-4">



            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 animate-pulse"></div>
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center mb-6 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium border border-blue-200 hover:bg-blue-200 transition-all duration-300 transform hover:scale-105">
              <Mail className="h-4 w-4 mr-2" />
              Solution complète de gestion syndicale
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-slate-800 mb-6 leading-tight animate-fade-in">
              Gérez votre syndicat comme une
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> boîte aux lettres</span> organisée
            </h1>

            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto opacity-90">
              Centralisez tous vos documents, communications et processus administratifs dans une plateforme intuitive
              et sécurisée.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-lg font-medium rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-lg flex items-center justify-center">
                Commencer gratuitement
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
              <button className="px-8 py-4 text-lg font-medium bg-white text-slate-700 rounded-xl border-2 border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                Voir la démo
              </button>
            </div>

            {/* Letter Box Visual */}
            <div className="relative max-w-3xl mx-auto group">
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-slate-200 hover:shadow-3xl transition-all duration-500 transform group-hover:scale-105">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="border-l-4 border-l-blue-500 pl-4 hover:bg-blue-50 transition-all duration-300 rounded-r-lg p-3">
                    <div className="pb-3">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <h3 className="text-sm font-medium">Documents</h3>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 bg-blue-100 rounded animate-pulse"></div>
                      <div className="h-2 bg-blue-100 rounded w-3/4 animate-pulse" style={{animationDelay: '0.1s'}}></div>
                      <div className="h-2 bg-blue-100 rounded w-1/2 animate-pulse" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>

                  <div className="border-l-4 border-l-green-500 pl-4 hover:bg-green-50 transition-all duration-300 rounded-r-lg p-3">
                    <div className="pb-3">
                      <div className="flex items-center space-x-2">
                        <Users className="h-5 w-5 text-green-600" />
                        <h3 className="text-sm font-medium">Membres</h3>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 bg-green-100 rounded animate-pulse" style={{animationDelay: '0.3s'}}></div>
                      <div className="h-2 bg-green-100 rounded w-4/5 animate-pulse" style={{animationDelay: '0.4s'}}></div>
                      <div className="h-2 bg-green-100 rounded w-2/3 animate-pulse" style={{animationDelay: '0.5s'}}></div>
                    </div>
                  </div>

                  <div className="border-l-4 border-l-purple-500 pl-4 hover:bg-purple-50 transition-all duration-300 rounded-r-lg p-3">
                    <div className="pb-3">
                      <div className="flex items-center space-x-2">
                        <Calculator className="h-5 w-5 text-purple-600" />
                        <h3 className="text-sm font-medium">Finances</h3>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 bg-purple-100 rounded animate-pulse" style={{animationDelay: '0.6s'}}></div>
                      <div className="h-2 bg-purple-100 rounded w-3/5 animate-pulse" style={{animationDelay: '0.7s'}}></div>
                      <div className="h-2 bg-purple-100 rounded w-4/5 animate-pulse" style={{animationDelay: '0.8s'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">
              Tout ce dont vous avez besoin, organisé comme une boîte aux lettres
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Chaque fonctionnalité a sa place, facilement accessible et parfaitement organisée
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: FileText, title: "Gestion documentaire", desc: "Stockez, organisez et partagez tous vos documents importants en toute sécurité", color: "blue" },
              { icon: Users, title: "Gestion des membres", desc: "Suivez les adhésions, cotisations et informations de tous vos membres", color: "green" },
              { icon: Calculator, title: "Comptabilité", desc: "Gérez votre budget, suivez les dépenses et générez des rapports financiers", color: "purple" },
              { icon: Mail, title: "Communication", desc: "Envoyez des newsletters, notifications et communiquez efficacement", color: "orange" },
              { icon: Shield, title: "Sécurité", desc: "Protection des données avec chiffrement et contrôle d'accès avancé", color: "red" },
              { icon: Clock, title: "Automatisation", desc: "Automatisez les tâches répétitives et gagnez du temps précieux", color: "teal" }
            ].map((feature, index) => (
              <div key={index} className="group p-6 hover:shadow-xl transition-all duration-300 border-0 shadow-md rounded-xl bg-white hover:bg-gradient-to-br hover:from-white hover:to-slate-50 transform hover:scale-105">
                <div className={`bg-${feature.color}-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`h-6 w-6 text-${feature.color}-600`} />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors duration-300">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">Nos services dédiés aux syndicats</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Des solutions adaptées à chaque type de syndicat et organisation
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-8">
                {[
                  { title: "Configuration personnalisée", desc: "Adaptation complète de la plateforme selon vos besoins spécifiques et votre structure organisationnelle." },
                  { title: "Formation et accompagnement", desc: "Formation complète de vos équipes et support continu pour une utilisation optimale." },
                  { title: "Migration de données", desc: "Transfert sécurisé de toutes vos données existantes vers notre plateforme." },
                  { title: "Support technique 24/7", desc: "Assistance technique disponible en permanence pour garantir la continuité de vos activités." }
                ].map((service, index) => (
                  <div key={index} className="flex items-start space-x-4 group hover:bg-white hover:shadow-lg rounded-xl p-4 transition-all duration-300 transform hover:scale-105">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-2 rounded-lg flex-shrink-0 group-hover:shadow-lg transition-all duration-300">
                      <CheckCircle className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors duration-300">{service.title}</h3>
                      <p className="text-slate-600">{service.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-2xl p-8 hover:shadow-3xl transition-all duration-500 transform hover:scale-105">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Prêt à commencer ?</h3>
                <p className="text-slate-600">Contactez-nous pour une démonstration personnalisée</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    placeholder="Prénom"
                    className="px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-300"
                  />
                  <input
                    placeholder="Nom"
                    className="px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-300"
                  />
                </div>
                <input
                  placeholder="Email professionnel"
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-300"
                />
                <input
                  placeholder="Nom du syndicat"
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-300"
                />
                <input
                  placeholder="Nombre de membres"
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-300"
                />
                <button className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
                  Demander une démo
                </button>
              </div>

              <div className="mt-6 flex items-center justify-center space-x-4 text-sm text-slate-500">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span>4.9/5</span>
                </div>
                <span>•</span>
                <span>500+ syndicats nous font confiance</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-slate-800 mb-6">Pourquoi choisir SyndicBox ?</h2>
            <p className="text-xl text-slate-600 mb-12">
              Nous comprenons les défis uniques des organisations syndicales et avons développé une solution qui répond
              spécifiquement à vos besoins.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {[
                { icon: Building2, title: "Expertise syndicale", desc: "10 ans d'expérience dans l'accompagnement des organisations syndicales", color: "blue" },
                { icon: Shield, title: "Sécurité garantie", desc: "Conformité RGPD et hébergement sécurisé en France", color: "green" },
                { icon: Users, title: "Support dédié", desc: "Équipe d'experts disponible pour vous accompagner au quotidien", color: "purple" }
              ].map((item, index) => (
                <div key={index} className="text-center group hover:bg-slate-50 rounded-xl p-6 transition-all duration-300 transform hover:scale-105">
                  <div className={`bg-${item.color}-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon className={`h-8 w-8 text-${item.color}-600`} />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors duration-300">{item.title}</h3>
                  <p className="text-slate-600">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <blockquote className="text-lg text-slate-700 italic mb-4">
                "SyndicBox a révolutionné notre façon de travailler. Nous avons gagné un temps précieux et amélioré
                notre communication avec nos membres."
              </blockquote>
              <div className="flex items-center justify-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-semibold">MR</span>
                </div>
                <div className="text-left">
                  <div className="font-semibold text-slate-800">Marie Rousseau</div>
                  <div className="text-slate-600">Secrétaire Générale, Syndicat CGT Métallurgie</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Contactez-nous</h2>
              <p className="text-xl text-slate-300">Notre équipe est là pour répondre à toutes vos questions</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-semibold mb-6">Parlons de votre projet</h3>

                <div className="space-y-6">
                  {[
                    { icon: Phone, title: "Téléphone", info: "+33 1 23 45 67 89" },
                    { icon: Mail, title: "Email", info: "contact@syndicbox.fr" },
                    { icon: MapPin, title: "Adresse", info: "123 Avenue de la République\n75011 Paris, France" }
                  ].map((contact, index) => (
                    <div key={index} className="flex items-center space-x-4 group hover:bg-slate-800 rounded-lg p-4 transition-all duration-300 transform hover:scale-105">
                      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-3 rounded-lg group-hover:shadow-lg transition-all duration-300">
                        <contact.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="font-semibold">{contact.title}</div>
                        <div className="text-slate-300 whitespace-pre-line">{contact.info}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-6 bg-slate-800 rounded-lg hover:bg-slate-700 transition-all duration-300 transform hover:scale-105">
                  <h4 className="font-semibold mb-2">Horaires d'ouverture</h4>
                  <div className="text-slate-300 space-y-1">
                    <div>Lundi - Vendredi: 9h00 - 18h00</div>
                    <div>Support technique: 24h/24, 7j/7</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 text-slate-800 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <h3 className="text-2xl font-semibold mb-6">Envoyez-nous un message</h3>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      placeholder="Prénom"
                      className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-300"
                    />
                    <input
                      placeholder="Nom"
                      className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-300"
                    />
                  </div>
                  <input
                    placeholder="Email"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-300"
                  />
                  <input
                    placeholder="Sujet"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-300"
                  />
                  <textarea
                    placeholder="Votre message..."
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-slate-50 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-300"
                  />
                  <button className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
                    Envoyer le message
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4 group">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-2 rounded-lg shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">SyndicBox</span>
              </div>
              <p className="text-slate-300 mb-4">
                La solution complète pour la gestion de votre syndicat, organisée comme une boîte aux lettres.
              </p>
            </div>

            {[
              { title: "Produit", links: ["Fonctionnalités", "Tarifs", "Sécurité", "API"] },
              { title: "Support", links: ["Documentation", "Formation", "Support technique", "FAQ"] },
              { title: "Entreprise", links: ["À propos", "Blog", "Carrières", "Contact"] }
            ].map((section, index) => (
              <div key={index}>
                <h4 className="font-semibold mb-4">{section.title}</h4>
                <ul className="space-y-2 text-slate-300">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a href="#" className="hover:text-white transition-colors duration-300 hover:underline">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-300">© 2024 SyndicBox. Tous droits réservés.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              {["Mentions légales", "Confidentialité", "CGU"].map((link, index) => (
                <a key={index} href="#" className="text-slate-300 hover:text-white transition-colors duration-300 hover:underline">
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}


