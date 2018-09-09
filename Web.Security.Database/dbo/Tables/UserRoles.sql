CREATE TABLE [dbo].[UserRoles] (
    [RoleId]        INT            NOT NULL,
    [UserId]        INT            NOT NULL,
    [Discriminator] NVARCHAR (MAX) NOT NULL,
    [UserId1]       INT            NULL,
    CONSTRAINT [PK_UserRoles] PRIMARY KEY CLUSTERED ([UserId] ASC, [RoleId] ASC),
    CONSTRAINT [FK_UserRoles_Role_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [dbo].[Role] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_UserRoles_User_UserId] FOREIGN KEY ([UserId]) REFERENCES [dbo].[User] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_UserRoles_User_UserId1] FOREIGN KEY ([UserId1]) REFERENCES [dbo].[User] ([Id])
);


GO
CREATE NONCLUSTERED INDEX [IX_UserRoles_RoleId]
    ON [dbo].[UserRoles]([RoleId] ASC);


GO
CREATE NONCLUSTERED INDEX [IX_UserRoles_UserId1]
    ON [dbo].[UserRoles]([UserId1] ASC);

