import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  console.log("🌱 Starting database seed...");

  try {
    // Create admin user
    const adminPassword = await bcrypt.hash("admin123", 12);
    const admin = await prisma.user.upsert({
      where: { email: "admin@paisagismo.com" },
      update: {},
      create: {
        name: "Admin do Sistema",
        email: "admin@paisagismo.com",
        password: adminPassword,
        role: "ADMIN",
        phone: "(11) 99999-9999",
      },
    });

    console.log("✅ Admin user created:", admin.email);

    // Create customer user
    const customerPassword = await bcrypt.hash("customer123", 12);
    const customer = await prisma.user.upsert({
      where: { email: "cliente@exemplo.com" },
      update: {},
      create: {
        name: "Cliente Exemplo",
        email: "cliente@exemplo.com",
        password: customerPassword,
        role: "CUSTOMER",
        phone: "(11) 88888-8888",
      },
    });

    console.log("✅ Customer user created:", customer.email);

    // Sample products for landscaping ecommerce
    const products = [
      {
        name: "Palmeira Imperial",
        description:
          "Palmeira Imperial majestosa, perfeita para entradas e jardins grandes. Altura média de 2-3 metros.",
        category: "PLANTS" as const,
        price: 450.0,
        stock: 15,
        sku: "PALM-IMPERIAL-001",
        images: [
          "https://http2.mlstatic.com/D_NQ_NP_948913-MLB48381910908_112021-O.webp",
          "https://images.tcdn.com.br/img/img_prod/694142/muda_de_palmeira_imperial_2009_4_4948b75c381e174a3129f4d9bfafa868.jpeg",
        ],
        careInstructions:
          "Sol pleno, rega moderada 2x por semana. Adubação trimestral.",
        height: 250,
        width: 120,
        depth: 120,
      },
      {
        name: "Vaso de Fibra de Coco Grande",
        description:
          "Vaso ecológico de fibra de coco, ideal para plantas ornamentais. Excelente drenagem e durabilidade.",
        category: "POTS" as const,
        price: 120.0,
        stock: 30,
        sku: "VASO-FIBRA-COCO-001",
        images: [
          "https://cdn.awsli.com.br/2500x2500/1023/1023584/produto/2648977945417512e54.jpg",
          "https://cdn.leroymerlin.com.br/products/3_vasos_de_fibra_de_coco_30cm_plantas_suspenso_com_corrente_1571255366_33ce_600x600.jpg",
        ],
        weight: 1500,
        height: 45,
        width: 40,
        depth: 40,
      },
      {
        name: "Kit Pás de Jardim Profissional",
        description:
          "Kit completo com 3 pás de jardim em aço inoxidável. Cabos ergonômicos e resistentes.",
        category: "TOOLS" as const,
        price: 89.9,
        stock: 25,
        sku: "KIT-PAS-PROF-001",
        images: [
          "https://cdn.awsli.com.br/600x700/1079/1079314/produto/266795070e41ce9ba7e.jpg",
          "https://m.media-amazon.com/images/I/61q7o6fHvhL.jpg",
        ],
        weight: 1200,
      },
      {
        name: "Adubo Orgânico para Gramados",
        description:
          "Adubo específico para gramados e jardins. Saco de 5kg com nutrientes balanceados.",
        category: "FERTILIZERS" as const,
        price: 45.9,
        stock: 40,
        sku: "ADUBO-GRAMA-5KG-001",
        images: [
          "https://static.wixstatic.com/media/090463_94ef1fbb118d4aea9e7310d3d0c9938f~mv2.jpeg/v1/fill/w_480,h_480,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/090463_94ef1fbb118d4aea9e7310d3d0c9938f~mv2.jpeg",
          "https://images.tcdn.com.br/img/img_prod/1279573/adubo_supergarden_para_jardins_500g_361_1_114a73e2df81e59c8b6b492c6b2c038f.jpg",
        ],
        weight: 5000,
      },
      {
        name: "Sementes de Grama Esmeralda",
        description:
          "Sementes de grama esmeralda de alta qualidade. Cobre até 20m² por pacote.",
        category: "SEEDS" as const,
        price: 35.9,
        stock: 50,
        sku: "SEM-GRAMA-ESM-001",
        images: [
          "https://a-static.mlcdn.com.br/1500x1500/semente-grama-esmeralda-100g-para-100m2-seeds/planttyseedsstore/556890716/6b08cc81ebbdd495f0873b22c07362cf.jpeg",
          "https://images.tcdn.com.br/img/img_prod/887756/sementes_de_grama_bermudas_bermudagrass_cynodon_dactylon_15_1_0a23d96efb8fa4e7f0bdde19ff41a38d.png",
        ],
        weight: 1000,
      },
      {
        name: "Sistema de Irrigação Automático",
        description:
          "Kit completo de irrigação automática para jardins até 50m². Timer programável incluído.",
        category: "ACCESSORIES" as const,
        price: 299.9,
        stock: 12,
        sku: "IRRIG-AUTO-50M2-001",
        images: [
          "https://m.media-amazon.com/images/I/71icVMhd8US._UF894,1000_QL80_.jpg",
          "https://down-br.img.susercontent.com/file/fddbd5a5c494f0306b29aea3b6c9704d",
        ],
        weight: 3500,
      },
      {
        name: "Bambu da Sorte",
        description:
          "Bambu da sorte em arranjo decorativo. Traz prosperidade e requer poucos cuidados.",
        category: "PLANTS" as const,
        price: 65.9,
        stock: 35,
        sku: "BAMBU-SORTE-001",
        images: [
          "https://chilflor.com.br/wp-content/uploads/2023/05/Arranjo-7M-3-Lucky-Bamboo-M-001.png",
          "https://cdn.awsli.com.br/600x450/1013/1013313/produto/173014101/0bcdddfe95.jpg",
        ],
        careInstructions:
          "Meia sombra, água trocada semanalmente. Evitar sol direto.",
        height: 40,
        width: 15,
        depth: 15,
      },
      {
        name: "Vaso de Cerâmica Artesanal",
        description:
          "Vaso de cerâmica pintado à mão. Peça única para decorar ambientes internos e externos.",
        category: "POTS" as const,
        price: 180.0,
        stock: 18,
        sku: "VASO-ARTESANAL-001",
        images: [
          "https://images.tcdn.com.br/img/img_prod/1177628/vaso_em_ceramica_artesanal_cogumelos_2109_8_c1e2c6dc8502af24c3ed6280e26cace9.jpg",
          "https://images.tcdn.com.br/img/img_prod/1177628/vaso_em_ceramica_artesanal_cogumelos_2109_9_88cda86d778e35fd996b05926c8b3073.jpg",
        ],
        weight: 3000,
        height: 50,
        width: 45,
        depth: 45,
      },
      {
        name: "Tesoura de Podar Profissional",
        description:
          "Tesoura de poda com lâmina de aço temperado. Corte preciso e confortável.",
        category: "TOOLS" as const,
        price: 55.9,
        stock: 30,
        sku: "TES-PODA-PROF-001",
        images: [
          "https://agromania.cdn.magazord.com.br/img/2022/08/produto/13919/tesoura-de-poda-78316502-ambientada-2.gif",
          "https://assets.tramontina.com.br/upload/tramon/imagens/MUL/78316502PDM001G.jpg",
        ],
        weight: 250,
      },
      {
        name: "Substrato para Plantas Ornamentais",
        description:
          "Substrato premium para vasos e jardineiras. Saco de 10kg com mix especial de nutrientes.",
        category: "FERTILIZERS" as const,
        price: 32.9,
        stock: 45,
        sku: "SUBSTRATO-10KG-001",
        images: [
          "https://cdn.leroymerlin.com.br/products/substrato_orquidea_1kg_89584593_d2d7_600x600.jpg",
          "https://blog.leroymerlin.com.br/wp-content/uploads/2024/05/substrato_suculentas_1kg_90268584_cbdf_600x600.jpg",
        ],
        weight: 10000,
      },
      {
        name: "Sementes de Hortênsia",
        description:
          "Sementes de hortênsia coloridas. Pacote com 15 sementes para jardins coloridos.",
        category: "SEEDS" as const,
        price: 18.9,
        stock: 60,
        sku: "SEM-HORTENSIA-15-001",
        images: [
          "https://i.etsystatic.com/60044640/r/il/15b6ca/7026418033/il_300x300.7026418033_9ukm.jpg",
          "https://seedfella.com/cdn/shop/files/51017BYlD4L._AC_SY355.jpg?v=1744840375",
        ],
        weight: 80,
      },
      {
        name: "Luvas de Jardim Reforçadas",
        description:
          "Luvas profissionais com proteção extra. Resistente a cortes e umidade.",
        category: "ACCESSORIES" as const,
        price: 29.9,
        stock: 55,
        sku: "LUVAS-JARDIM-001",
        images: [
          "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m85u2zb1vtw19f",
          "https://cf.shopee.com.br/file/br-11134207-7qukw-libx9zjwtvowbc",
        ],
        weight: 150,
      },
    ];

    for (const product of products) {
      await prisma.product.upsert({
        where: { sku: product.sku },
        update: {},
        create: product,
      });
    }

    console.log(`✅ ${products.length} products created`);
    console.log("🎉 Database seed completed successfully!");

    // Log credentials for testing
    console.log("\n🔐 Login credentials for testing:");
    console.log("Admin - Email: admin@paisagismo.com | Password: admin123");
    console.log(
      "Customer - Email: cliente@exemplo.com | Password: customer123"
    );
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
