class EcoVariablesController < ApplicationController

	def eco_variables_search
	    ecovar = EcoVariablesSpecies.where(user_id:current_user.id, :species_id => params[:species_id])
	    result = ecovar.collect do |t|
	      { eco_id: t.eco_variable_id, eco_selected: t.selected}
	    end

	    render json: result
  	end

  	def add_ecological_variable
	    @eco_variable = EcoVariablesSpecies.where(:species_id => params[:species_id], :user_id => current_user.id, :eco_variable_id => params[:eco_variable_id]).first

	    if @eco_variable.blank?
	      EcoVariablesSpecies.create({:species_id => params[:species_id], :user_id => current_user.id, :eco_variable_id => params[:eco_variable_id],:selected => params[:selected]})
	    else
	      EcoVariablesSpecies.update(@eco_variable.id, {:selected => params[:selected]})
	    end

	    respond_to do |format|
	        format.js
	    end
  end

end