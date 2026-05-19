export const products = [
  {
    id: "notebook-pro",
    name: "Notebook Pro 14",
    category: "Computación",
    price: 899990,
    stock: 8,
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80",
    description:
      "Liviano y cómodo para clases online, desarrollo web y trabajo diario.",
  },
  {
    id: "audifonos-studio",
    name: "Audífonos Studio",
    category: "Audio",
    price: 69990,
    stock: 15,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
    description:
      "Audífonos cerrados con sonido equilibrado para estudiar con menos ruido alrededor.",
  },
  {
    id: "teclado-mecanico",
    name: "Teclado Mecánico",
    category: "Accesorios",
    price: 54990,
    stock: 10,
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=80",
    description:
      "Teclado compacto, con switches táctiles y luz blanca para escribir con comodidad.",
  },
  {
    id: "monitor-ultrawide",
    name: "Monitor Ultrawide",
    category: "Pantallas",
    price: 249990,
    stock: 6,
    image:
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=80",
    description:
      "Pantalla amplia para tener código, navegador y documentación a la vista.",
  },
];

export const formatPrice = (value) =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(value);
