import { ApiProperty } from '@nestjs/swagger';

export class SlackUser {
  @ApiProperty()
  id: string;

  @ApiProperty()
  team_id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  deleted: boolean;

  @ApiProperty()
  color: string;

  @ApiProperty()
  real_name: string;

  @ApiProperty()
  tz: string;

  @ApiProperty()
  tz_label: string;

  @ApiProperty()
  tz_offset: number;

  @ApiProperty()
  profile: {
    title: string;
    phone: string;
    skype: string;
    real_name: string;
    real_name_normalized: string;
    display_name: string;
    display_name_normalized: string;
    fields: Record<string, string>;
    status_text: string;
    status_emoji: string;
    status_emoji_display_info: any[]; 
    status_expiration: number;
    avatar_hash: string;
    always_active: boolean;
    first_name: string;
    last_name: string;
    image_24: string;
    image_32: string;
    image_48: string;
    image_72: string;
    image_192: string;
    image_512: string;
    status_text_canonical: string;
    team: string;
  };

  @ApiProperty()
  is_admin: boolean;

  @ApiProperty()
  is_owner: boolean;

  @ApiProperty()
  is_primary_owner: boolean;

  @ApiProperty()
  is_restricted: boolean;

  @ApiProperty()
  is_ultra_restricted: boolean;

  @ApiProperty()
  is_bot: boolean;

  @ApiProperty()
  is_app_user: boolean;

  @ApiProperty()
  updated: number;

  @ApiProperty()
  is_email_confirmed: boolean;

  @ApiProperty()
  who_can_share_contact_card: string;
}

export class SlackChannel {
    @ApiProperty()
    id: string;
  
    @ApiProperty()
    name: string;
  
    @ApiProperty()
    is_channel: boolean;
  
    @ApiProperty()
    is_group: boolean;
  
    @ApiProperty()
    is_im: boolean;
  
    @ApiProperty()
    is_mpim: boolean;
  
    @ApiProperty()
    is_private: boolean;
  
    @ApiProperty()
    created: number;
  
    @ApiProperty()
    is_archived: boolean;
  
    @ApiProperty()
    is_general: boolean;
  
    @ApiProperty()
    unlinked: number;
  
    @ApiProperty()
    name_normalized: string;
  
    @ApiProperty()
    is_shared: boolean;
  
    @ApiProperty()
    is_org_shared: boolean;
  
    @ApiProperty()
    is_pending_ext_shared: boolean;
  
    @ApiProperty()
    pending_shared: any[]; // You might want to specify the correct type here
  
    @ApiProperty()
    context_team_id: string;
  
    @ApiProperty()
    updated: number;
  
    @ApiProperty()
    parent_conversation: any; // You might want to specify the correct type here
  
    @ApiProperty()
    creator: string;
  
    @ApiProperty()
    is_ext_shared: boolean;
  
    @ApiProperty()
    shared_team_ids: string[];
  
    @ApiProperty()
    pending_connected_team_ids: string[];
  
    @ApiProperty()
    is_member: boolean;
  
    @ApiProperty()
    topic: {
      value: string;
      creator: string;
      last_set: number;
    };
  
    @ApiProperty()
    purpose: {
      value: string;
      creator: string;
      last_set: number;
    };
  
    @ApiProperty()
    previous_names: string[];
  
    @ApiProperty()
    num_members: number;
  }
