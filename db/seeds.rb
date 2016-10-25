# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

# GroupState.create(:id => 1, :name => "Aprobado")
# GroupState.create(:id => 2, :name => "Pendiente Aprobación")
# GroupState.create(:id => 3, :name => "Rechazado")
# GroupState.create(:id => 4, :name => "Inactivo")

Group.create(:name => "Aves del Venado de Oro", :message => "Mensaje de prueba", :group_state_id => 1)
Group.create(:name => "Mamiferos de Colombia", :message => "Bienvenidos al grupo de mamiferos de Colombia. Si tiene algún inconveniente escríbanos su caso.", :group_state_id => 1)


TasksType.create(:id => 1, :name => "Curaduría de registros")
TasksType.create(:id => 2, :name => "Edición")

# 
GroupsUser.create(:group_id => 2, :user_id => 1, :groups_users_state_id => 1, :is_admin => true)
GroupsUser.create(:group_id => 2, :user_id => 2, :groups_users_state_id => 1, :is_admin => false)
GroupsUser.create(:group_id => 2, :user_id => 3, :groups_users_state_id => 1, :is_admin => false)

TaskState

# Task.create(:species_id => 2, :user_id => 1, :group_id => 2, :task_type_id => 1)
# Task.create(:species_id => 2, :user_id => 2, :group_id => 2, :task_type_id => 1)
# Task.create(:species_id => 4, :user_id => 3, :group_id => 2, :task_type_id => 2)