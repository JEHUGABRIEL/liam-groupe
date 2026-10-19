import Checkout from "@/components/account/Checkout";

export const metadata = { title: "Commande" };

export default function CheckoutPage() {
  return (
    <section className="bg-gris-clair py-14 md:py-20">
      <div className="conteneur">
        <p className="t-label text-encre/60">Panier</p>
        <h1 className="titre-heros mt-3">Ma commande.</h1>
        <div className="mt-10">
          <Checkout />
        </div>
      </div>
    </section>
  );
}
