Rails.application.routes.draw do
  devise_for :users, controllers: { registrations: "registrations" }
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  root 'home#show'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  get "species/autocomplete"
  get "species/visor"
  get "home/contact_us"
  get "home/about_us"
  get "home/publish"
  get "home/api"
  get "home/terms"
  post "users_layers/load_layer"
  post "users_layers/pause_layer"
  post "users_layers/send_layer"
  post "reports/update_record"
  post "species/set_species"
  post "records/report_record"
  post "records/edit_record"
  post "species/species_info"
  post "records/send_report_record"
  post "models/load_initial_model"
  post "models/get_thresholds"
  post "models/get_hypotheses"
  post "models/download_model"
  post "models/download_terms"
  post "models/models_stats"
  get "models/metadata"
  get "records/records_metadata/:id" => "records#records_metadata", as: "records_metadata"
  get "species/search"
  post "ratings/rate_model"
  get "eco_variables/eco_variables_search"
  post "eco_variables/add_ecological_variable"
  get "species/:id/get_species_records" => "species#get_species_records"
  post "records/new_record"
  post "records/new_report"
  post "records/update_record"
  post "tasks/add_tasks"
  post "tasks/finish_task"
  post "tasks/tasks_by_group"
  post "tasks/tasks_by_user"
  post "groups_species/species_by_group"
  post "groups_species/update_groups_species"
  post "groups/bulk_group_email"
  post "groups/suggest_group"
  post "groups_users/users_by_group"
  post "groups_users/update_groups_user"
  post "users/send_message_to_user"
  post "groups/group_activity"
  post "home/upload_model"
  post "species/filter"
  # get "models/metadata/:id"
  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products
  resources :users, :only => [:show]
  resources :groups, :only => [:index, :show, :update]
  resources :info, :only => [:index]
  resources :groups_species, :only => [:index, :create]
  resources :groups_users, :only => [:index, :create]
  resources :tasks, :only => [:index, :create]
  resources :ratings, :only => [:destroy]
  resources :models do
    member do
      get :metadata
    end
  end

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end 

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
