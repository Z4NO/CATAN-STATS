from app.db.session import Base, engine

print("Base.metadata.tables:")
print(Base.metadata.tables)

Base.metadata.create_all(bind=engine)
print("✅ Base de datos creada (aunque esté vacía)")
