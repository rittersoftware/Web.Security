CREATE TABLE [dbo].[RoleClaim] (
    [Id]            INT            IDENTITY (1, 1) NOT NULL,
    [RoleId]        INT            NOT NULL,
    [ClaimType]     NVARCHAR (MAX) NULL,
    [ClaimValue]    NVARCHAR (MAX) NULL,
    [Discriminator] NVARCHAR (MAX) NOT NULL,
    CONSTRAINT [PK_RoleClaim] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_RoleClaim_Role_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [dbo].[Role] ([Id]) ON DELETE CASCADE
);


GO
CREATE NONCLUSTERED INDEX [IX_RoleClaim_RoleId]
    ON [dbo].[RoleClaim]([RoleId] ASC);

