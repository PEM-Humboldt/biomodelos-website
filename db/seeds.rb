# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
# User.create(name:'Carlos Perez', organization:'Instituto Humboldt',location:'Bogota',expertise:'Aves',bio:'Soy Biologo de la Universidad de la Vida',email:'test@test.com',encrypted_password:'12345678')

# GroupState.create(:id => 1, :name => "Aprobado")
# GroupState.create(:id => 2, :name => "Pendiente Aprobación")
# GroupState.create(:id => 3, :name => "Rechazado")
# GroupState.create(:id => 4, :name => "Inactivo")

Group.create(:name => "Aves del Venado de Oro", :message => "Mensaje de prueba", :group_state_id=> 1)

