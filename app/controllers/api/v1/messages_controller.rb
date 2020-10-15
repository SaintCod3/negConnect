class Api::V1::MessagesController < Api::V1::BaseController
  before_action :authorized
  def index
    @chats = Message.where("request_id": params[:request_id])
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
    @message = Message.create(message_params)
    respond_with :api, :v1, @message, location: -> { api_v1_request_conversation_messages_url(@message) }
  end

  private

 def verified_user 
    Conversation.where(user_id: params[:user_id], request_id:
    params[:request_id]).exists? 
  end

  def verified_volunteer
    Volunteer.where(user_id: params[:user_id], request_id:
    params[:request_id]).exists?
  end

  def requestor
    Request.where(user_id: params[:user_id], id:
    params[:request_id]).exists?
  end

  def message_params
    params.require(:message).permit(:chat, :conversation_id, :user_id)
  end
end