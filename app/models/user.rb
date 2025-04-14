class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  validates_presence_of  :name, :message=>"Ingrese su nombre y apellido."
  validates :terms_of_service, acceptance: { message: :terms_not_accepted }
  validates :data_policy, acceptance: { message: :policy_not_accepted }
  
  has_many :tasks
  has_many :tasks_created, :class_name => "Task", :foreign_key => "created_by"
  has_many :tasks_completed, :class_name => "Task", :foreign_key => "completed_by "
  has_many :groups_users
  has_many :groups, through: :groups_users
  has_many :users_layers
  has_many :ratings
  has_many :downloads

  mount_uploader :avatarURL, UserAvatarUploader

end