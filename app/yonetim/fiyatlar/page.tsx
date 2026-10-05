"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  readAdminProducts,
  type AdminProduct,
  writeAdminProducts,
} from "../../../lib/admin-products";

type PriceRow = {
  id: string;
  product: string;
  cm30: number;
  cm40: number;
  cm50: number;
  remoteExtra: number;
  special: string;
};
function readRows(): PriceRow[] {
  return readAdminProducts().map((product) => ({
    id: product.id,
    product: product.title,
    cm30: Number(product.price30) || 0,
    cm40: Number(product.price40) || 0,
    cm50: Number(product.price50) || 0,
    remoteExtra: Number(product.remoteExtra) || 0,
    special: product.specialPrice,
  }));
}

export default function PriceManagementPage() {
  const [rows, setRows] = useState<PriceRow[]>(readRows);
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    const refresh = () => setRows(readRows());
    window.addEventListener("storage", refresh);
    window.addEventListener("3dbade-products-updated", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("3dbade-products-updated", refresh);
    };
  }, []);
  const updateRow = (
    id: string,
    field: keyof PriceRow,
    value: string | number,
  ) =>
    setRows((current) =>
      current.map((row) => (row.id === id ? { ...row, [field]: value } : row)),
    );
  function savePrices() {
    const byId = new Map(rows.map((row) => [row.id, row]));
    const next: AdminProduct[] = readAdminProducts().map((product) => {
      const row = byId.get(product.id);
      if (!row) return product;
      return {
        ...product,
        title: row.product,
        price30: String(row.cm30),
        price40: String(row.cm40),
        price50: String(row.cm50),
        remoteExtra: String(row.remoteExtra),
        specialPrice: row.special,
      };
    });
    writeAdminProducts(next);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  }

  return (
    <main className="price-admin-page compact-price-page">
      <section className="price-admin-content">
        <div className="compact-price-title">
          <div>
            <p>FİYAT YÖNETİMİ</p>
            <h1>Ürün fiyatları</h1>
          </div>
          <div>
            <Link href="/yonetim/urunler">ÜRÜN GİRİŞİ</Link>
            <Link href="/yonetim/urunler">+ ÜRÜN EKLE</Link>
          </div>
        </div>
        <div className="spreadsheet-wrap">
          <table className="price-spreadsheet">
            <thead>
              <tr>
                <th>Ürün adı</th>
                <th>30 cm</th>
                <th>40 cm</th>
                <th>50 cm</th>
                <th>Kumanda +</th>
                <th>Özel ölçü</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>
                    <input
                      value={row.product}
                      onChange={(event) =>
                        updateRow(row.id, "product", event.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      value={row.cm30}
                      onChange={(event) =>
                        updateRow(row.id, "cm30", Number(event.target.value))
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      value={row.cm40}
                      onChange={(event) =>
                        updateRow(row.id, "cm40", Number(event.target.value))
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      value={row.cm50}
                      onChange={(event) =>
                        updateRow(row.id, "cm50", Number(event.target.value))
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      value={row.remoteExtra}
                      onChange={(event) =>
                        updateRow(
                          row.id,
                          "remoteExtra",
                          Number(event.target.value),
                        )
                      }
                    />
                  </td>
                  <td>
                    <input
                      value={row.special}
                      onChange={(event) =>
                        updateRow(row.id, "special", event.target.value)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="compact-price-footer">
          <button className="price-save" onClick={savePrices}>
            KAYDET
          </button>
          {saved && (
            <strong className="price-saved">
              Kaydedildi. Ürün yönetiminde de güncel fiyatlar görünür.
            </strong>
          )}
          <small>
            Fiyatlar TL olarak girilir. Kumanda sütunundaki rakam, seçildiğinde
            ölçü fiyatına eklenir.
          </small>
        </div>
      </section>
    </main>
  );
}
