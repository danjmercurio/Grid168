class ZohoController < ApplicationController
  def getContacts
    name = params[:name]
    email = params[:email]
    @contact = RubyZoho::Crm::Contact.find_by_last_name(name)
    respond_to do |format|
      format.json {
        render :json => @contact.to_json
      }
    end
  end
end
