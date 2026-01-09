import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from users.models import User

def create_teacher(username, first_name, last_name, email, password):
    if not User.objects.filter(username=username).exists():
        user = User.objects.create_user(username=username, email=email, password=password)
        user.first_name = first_name
        user.last_name = last_name
        user.role = 'docente'
        user.save()
        print(f"✅ Usuario creado exitosamente:")
        print(f"   Nombre: {first_name} {last_name}")
        print(f"   Usuario: {username}")
        print(f"   Email: {email}")
        print(f"   Contraseña: {password}")
        print(f"   Rol: Docente")
    else:
        print(f"⚠️ El usuario {username} ya existe.")

if __name__ == '__main__':
    # Creando a la profesora Clara Rodríguez
    create_teacher(
        username='clara.rodriguez',
        first_name='Clara',
        last_name='Rodríguez',
        email='clara.rodriguez@leccionmagica.edu.co',
        password='Password123!'
    )
