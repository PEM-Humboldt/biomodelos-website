class Group < ApplicationRecord
	has_many :groups_users
  has_many :users, through: :groups_users
  #has_many :admin, through: :game_users, ->  where(is_admin: true)
  has_many :admin, -> { where is_admin: true }, class_name: 'GroupsUser'
  
  mount_uploader :logo, GroupLogoUploader

  	def activity
      Group.find_by_sql(
        "(SELECT u.id, u.name user_name,'0' sp_id, '' task_name, gu.created_at updated_at, 'new_user' as tipo
          FROM users u, groups_users gu
          WHERE u.id = gu.user_id AND gu.groups_users_state_id = 1 AND gu.group_id = "+self.id.to_s+"
          ORDER BY gu.created_at DESC 
          LIMIT 15) 

          UNION ALL

        (SELECT u.id, u.name user_name, t.species_id sp_id, tt.name task_name, t.updated_at, 'task_done' tipo
        FROM tasks t, task_types tt, users u
        WHERE t.task_type_id = tt.id AND t.user_id = u.id AND t.group_id = "+self.id.to_s+" AND t.task_state_id = 2
        ORDER BY t.updated_at DESC
        LIMIT 15)
        ORDER BY updated_at DESC
        LIMIT 15")
  	end
end