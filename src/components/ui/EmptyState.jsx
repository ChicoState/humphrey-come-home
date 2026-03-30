/**
 * EmptyState — centered placeholder for when there's no content.
 *
 * @prop {Component} [icon]     — Lucide icon displayed above the title
 * @prop {string}    title      — main heading
 * @prop {string}    [subtitle] — secondary text below the heading
 * @prop {ReactNode} [button]   — optional CTA (usually a <Button>)
 * @prop {boolean}   [compact]  — smaller layout for inline usage
 */
import { VStack, Text } from "@/components/primitives";
import Badge from "./Badge";
import Button from "./Button";
import styles from "./EmptyState.module.css";

export default function EmptyState({ icon: Icon, title, subtitle, button, compact, badge }) {
  return (
    <div className={`${styles.container} ${compact ? styles.compact : ''}`}>
      {Icon && (
        <div className={styles.iconWrap}>
          <Icon size={48} strokeWidth={2.2} className={styles.icon} />
        </div>
      )}
      {badge && <Badge variant="warning">{badge}</Badge>}
      <VStack gap={2} align="center" style={{ textAlign: 'center' }}>
        {title && <Text variant="subtitle">{title}</Text>}
        {subtitle && <Text variant="body" color="muted" style={{ maxWidth: '32ch' }}>{subtitle}</Text>}
      </VStack>
      {button && (
        <Button variant="primary" onClick={button.onPress} style={{ marginTop: 8 }}>
          {button.label}
        </Button>
      )}
    </div>
  );
}
