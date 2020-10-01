class Api::V1::ChatsController < Api::V1::BaseController

  def index
    @chats = Chat.where("request_id": params[:request_id])
    @request = Request.where("id": params[:request_id])
    if verified_user or requestor 
     render json: {chat: @chats.as_json({except: [:id, :request_id, :updated_at],
      :include => [user: {except: [:id, :password_digest, :email, :created_at, :updated_at]}]
    }), request: @request}
    else
     render json: {}, status: 401
    end
  end

  def create
    @chat = Chat.create(chats_params)
    respond_with :api, :v1, @chat, location: -> { api_v1_request_chats_url(@chat) }
  end

  def destroy
    respond_with Chat.destroy(params[:id])
  end

  private

  def verified_user 
    Volunteer.where(user_id: params[:user_id], request_id:
    params[:request_id]).exists?
  end

  def requestor
    Request.where(user_id: params[:user_id], id:
    params[:request_id]).exists?
  end

  def chats_params
    params.require(:chat).permit(:id, :user_id, :request_id, :message)
  end
end
