
---

## **BACA**

### **Memulai dan Mengelola Docker Compose**

```bash
# Menjalankan program untuk pertama kali
docker-compose up --build 

# Menjalankan ulang
docker-compose start

# Menghentikan instance yang sedang berjalan
docker-compose stop

# Mematikan server Docker
docker-compose down
```

---

### **Membersihkan Komputer dari Sisa Docker**

```bash
# Mematikan semua image yang ada
docker-compose down

# Melihat semua image yang ada
docker images

# Membersihkan image yang tidak digunakan
docker image prune -a -f

# Melihat daftar volume yang ada
docker volume ls

# Menghapus semua volume yang tidak digunakan
docker volume prune
```

---

### **Memantau Docker yang Sedang Berjalan**

```bash
# Menampilkan container Docker yang aktif
docker ps
```

--- 

