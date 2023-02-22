import hashlib
hash = hashlib.sha1("josphatkips@gmail.com".encode("UTF-8")).hexdigest()
print(hash[:10])