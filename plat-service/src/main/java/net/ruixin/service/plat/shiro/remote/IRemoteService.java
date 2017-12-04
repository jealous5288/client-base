package net.ruixin.service.plat.shiro.remote;

import org.apache.shiro.session.Session;

import java.io.Serializable;

public interface IRemoteService {

    Session getSession(String appKey, Serializable sessionId);
    Serializable createSession(Session session);
    void updateSession(String appKey, Session session);
    void deleteSession(String appKey, Session session);
    PermissionContext getPermissions(String appKey, String username);
}
