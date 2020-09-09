class UsersLayersController < ApplicationController

	def create
	    @layer = UsersLayer.new(layer_params)

	    if @layer.save
	    	respond_to do |format|
	        	format.js
	    	end
	    else
	    	render :js => "alertify.alert('Se ha producido un error al crear la capa de edición.');"
	    end
  	end

  	def pause_layer
  		if params[:id].blank?
	      @layer = UsersLayer.create({:species_id => params[:species_id], :user_id => current_user.id, :threshold => params[:threshold], :newModel => params[:newModel], :geoJSON => params[:geoJSON]})
	    else
	      @layer = UsersLayer.find(params[:id])
	      UsersLayer.update(@layer.id, {:threshold => params[:threshold], :geoJSON => params[:geoJSON]})
	    end
	    
	    respond_to do |format|
	        format.js
	    end
	    # render :js => "alertify.alert('Se ha pausado la edición del modelo.');"

	end

	def send_layer
		if params[:id].blank?
	      UsersLayer.create({:species_id => params[:species_id], :user_id => current_user.id, :threshold => params[:threshold], :newModel => params[:newModel], :final => true, :geoJSON => params[:geoJSON]})
	    else
	      @layer = UsersLayer.find(params[:id])
	      UsersLayer.update(@layer.id, {:threshold => params[:threshold], :final => true, :geoJSON => params[:geoJSON]})
	    end

	    render :js => "alertify.alert('Se ha enviado la versión final de la edición del modelo.');"
	end

	def load_layer
		new_model = params[:new_map] == "true" ? true : false
		@layer = UsersLayer.where(:user_id => current_user.id, :species_id => params[:species_id], :final => false, :newModel => new_model).first
		respond_to do |format|
	        format.js
	    end
	end

	private

    def layer_params
      params.require(:users_layer).permit(:user_id, :species_id, :threshold, :newModel, :final, :geoJSON)
    end
end