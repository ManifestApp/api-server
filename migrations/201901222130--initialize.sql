drop table if exists system_metadata;
create table system_metadata (
  key varchar(255) primary key,
  value jsonb
);

drop table if exists protester cascade;
create table protester (
    id uuid primary key,
    nickname varchar(255),
    auth_token uuid,
    device_token varchar(255)
);

drop table if exists protest cascade;
create table protest (
    id uuid primary key,
    creator uuid references protester(id) not null,
    title varchar(255) not null,
    description text,
    image_url varchar(255),
    starting_position point not null,
    starting_time timestamp with time zone not null
);

drop table if exists protester_in_protest;
create table protester_in_protest (
    protester uuid references protester(id),
    protest uuid references protest(id),
    constraint pk_protester_in_protest primary key (protester, protest)
);

drop table if exists protester_trust_relation;
create table protester_trust_relation (
    id uuid primary key,
    truster uuid references protester(id) not null,
    creation_date timestamp with time zone not null,
    expiration_date timestamp with time zone,
    trustee uuid references protester(id)
);

insert into system_metadata values ('201901222130--initialize.sql', to_json(now()));