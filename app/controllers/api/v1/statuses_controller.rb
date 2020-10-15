class Api::V1::StatusesController < Api::V1::BaseController
  before_action :authorized
  
  def index
    respond_with Status.all
  end
  
  def show
    respond_with Status.find(params[:id])
  end

  def create
    @status = Status.create(statuses_params)
    respond_with :api, :v1, @status, location: -> { api_v1_statuses_url(@status) }
  end

  def destroy
    respond_with Status.destroy(params[:id])
  end

  def update
    statuses = Status.find(params["id"])
    statuses.update_attributes(statuses_params)
    respond_with statuses, json: statuses
  end

  private

  def statuses_params
    params.require(:status).permit(:id, :name)
  end
end