class Api::V1::VolunteersController < Api::V1::BaseController
  before_action :find_request

  def index
    @volunteers = Volunteer.where(request_id: params[:request_id])
    render json: {volunteers: @volunteers}
  end

  def create

    if already_volunteer?
        render json: {"message": "You have already volunteered to this request"}, status: 500
    elsif requestor
        render json: {"message": "You can't volunteer to your own request"}, status: 500
    else
        @request.volunteers.create(user_id: params[:user_id], request_id:
        params[:request_id])
        render json: {"message": "Volunteered"}
    end
  end

  private

  def find_request
    @request = Request.find(params[:request_id])
  end

  def already_volunteer?
    Volunteer.where(user_id: params[:user_id], request_id:
    params[:request_id]).exists?
  end
  
 def requestor
    Request.where(user_id: params[:user_id], id:
    params[:request_id]).exists?
  end

  def volunteer_params
    params.require(:volunteer).permit(:user_id, :request_id)
  end
end